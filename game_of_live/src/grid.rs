use std::ops::{BitOr, BitXor};
use wasm_bindgen::prelude::wasm_bindgen;

use rustc_hash::FxHashMap;

const CHUNK_SIZE: u32 = 64;

#[wasm_bindgen]
#[derive(Debug)]
pub struct CellID {
    pub chunk_pos_x: i32,
    pub chunk_pos_y: i32,
    pub cell_index: u32,
}

#[wasm_bindgen]
impl CellID {
    #[wasm_bindgen(constructor)]
    pub fn new(chunk_pos_x: i32, chunk_pos_y: i32, index: u32) -> Self {
        Self {
            chunk_pos_x,
            chunk_pos_y,
            cell_index: index,
        }
    }
}

#[wasm_bindgen]
//Size of 64x64
#[derive(Debug, Clone)]
pub struct Chunk {
    pos_x: i32,
    pos_y: i32,
    cells: Vec<u64>,
    active: bool,
}

#[wasm_bindgen]
impl Chunk {
    pub fn new(pos_x: i32, pos_y: i32) -> Self {
        let cells = vec![0; CHUNK_SIZE as usize];

        Self {
            pos_x,
            pos_y,
            cells,
            active: false,
        }
    }

    //gets_if the cell is alive
    pub fn cell_alive(&self, index: u32) -> bool {
        //check if self is active if not there are no cells in the chunk
        if !self.active {
            return false;
        }

        assert!(index < CHUNK_SIZE * CHUNK_SIZE);

        let row = index / CHUNK_SIZE;
        let col = index % CHUNK_SIZE;

        let cell = self.cells[row as usize] << CHUNK_SIZE - 1 - col >> CHUNK_SIZE - 1;

        return cell != 0;
    }

    fn get_cellid(&self, row: i32, col: i32) -> CellID {
        let offset_y = (row >= CHUNK_SIZE as i32) as i32 - (row < 0) as i32;
        let offset_x = (col >= CHUNK_SIZE as i32) as i32 - (col < 0) as i32;

        let chunk_pos_y = self.pos_y + offset_y;
        let chunk_pos_x = self.pos_x + offset_x;

        let in_chunk_row = row.rem_euclid(CHUNK_SIZE as i32);
        let in_chunk_col = col.rem_euclid(CHUNK_SIZE as i32);

        let index = in_chunk_row * CHUNK_SIZE as i32 + in_chunk_col;

        CellID {
            cell_index: index as u32,
            chunk_pos_x,
            chunk_pos_y,
        }
    }

    pub fn flip_cell(&mut self, index: u32) {
        assert!(index < CHUNK_SIZE * CHUNK_SIZE);

        let row = index / CHUNK_SIZE;
        let col = index % CHUNK_SIZE;
        let row_cells = self.cells[row as usize].bitxor(1 << col);
        self.cells[row as usize] = row_cells;

        self.active = false;
        for x in self.cells.iter() {
            if x != &0 {
                self.active = true;
                break;
            }
        }
    }

    pub fn set_cell_alive(&mut self, index: u32) {
        assert!(index < CHUNK_SIZE * CHUNK_SIZE);

        let row = index / CHUNK_SIZE;
        let col = index % CHUNK_SIZE;
        let row_cells = self.cells[row as usize].bitor(1 << col);
        self.cells[row as usize] = row_cells;

        self.active = true;
    }

    fn get_neighbour_count(&self, index: u32, cached: &[Chunk; 9]) -> u8 {
        assert!(index < CHUNK_SIZE * CHUNK_SIZE);
        let row = index / CHUNK_SIZE;
        let col = index % CHUNK_SIZE;

        let mut neighbour_count: u8 = 0;
        // check if all cells are in the current chunk
        if col > 0 && col < CHUNK_SIZE - 1 && row > 0 && row < CHUNK_SIZE - 1 {
            for x in -1..=1 as i32 {
                let row_cells = self.cells[(row as i32 + x) as usize] >> col - 1 << CHUNK_SIZE - 3;
                neighbour_count += row_cells.count_ones() as u8;
            }

            if self.cell_alive(index) {
                neighbour_count -= 1;
            }
        } else {
            // println!("on border");
            for y in 0..3 {
                for x in 0..3 {
                    let id = self.get_cellid(row as i32 + x - 1, col as i32 + y - 1);
                    if id.cell_index == index as u32 {
                        continue;
                    }
                    if id.chunk_pos_x == self.pos_x && id.chunk_pos_y == self.pos_y {
                        if self.cell_alive(id.cell_index) {
                            neighbour_count += 1;
                        }

                        continue;
                    }

                    let cached_index: usize = ((id.chunk_pos_y - self.pos_y + 1) * 3
                        + (id.chunk_pos_x - self.pos_x + 1))
                        as usize;

                    if cached[cached_index].cell_alive(id.cell_index) {
                        neighbour_count += 1;
                    };
                }
            }
        }

        return neighbour_count;
    }

    fn update(&self, cached: &[Chunk; 9]) -> Chunk {
        let mut new_chunk = Chunk::new(self.pos_x, self.pos_y);

        for cell_index in 0..CHUNK_SIZE * CHUNK_SIZE {
            let count = self.get_neighbour_count(cell_index, cached);
            let alive = self.cell_alive(cell_index);

            if !alive && count == 3 {
                new_chunk.set_cell_alive(cell_index);
            }
            if alive && (count == 3 || count == 2) {
                new_chunk.set_cell_alive(cell_index);
            }
        }

        new_chunk
    }

    pub fn active(&self) -> bool {
        self.active
    }

    pub fn cells(&self) -> Vec<u64> {
        self.cells.clone()
    }

    pub fn get_pos_x(&self) -> i32 {
        self.pos_x
    }

    pub fn get_pos_y(&self) -> i32 {
        self.pos_y
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct Grid {
    chunks: FxHashMap<(i32, i32), Chunk>,
    active_chunks: Vec<Chunk>,
    iteration: u64,
}

#[wasm_bindgen]
impl Grid {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            chunks: FxHashMap::default(),
            active_chunks: Vec::new(),
            iteration: 0,
        }
    }

    pub fn update(&mut self) {
        let current_state = self.clone();

        //remove all chunks
        self.chunks.clear();
        self.active_chunks.clear();

        for chunk in current_state.chunks.values() {
            let cached = [
                current_state.get_chunk(KeySimd(chunk.pos_x - 1, chunk.pos_y - 1)),
                current_state.get_chunk(KeySimd(chunk.pos_x, chunk.pos_y - 1)),
                current_state.get_chunk(KeySimd(chunk.pos_x + 1, chunk.pos_y - 1)),
                current_state.get_chunk(KeySimd(chunk.pos_x - 1, chunk.pos_y)),
                current_state.get_chunk(KeySimd(chunk.pos_x, chunk.pos_y)),
                current_state.get_chunk(KeySimd(chunk.pos_x + 1, chunk.pos_y)),
                current_state.get_chunk(KeySimd(chunk.pos_x - 1, chunk.pos_y + 1)),
                current_state.get_chunk(KeySimd(chunk.pos_x, chunk.pos_y + 1)),
                current_state.get_chunk(KeySimd(chunk.pos_x + 1, chunk.pos_y + 1)),
            ];

            let new_cunk = chunk.update(&cached);

            //add all relevent chunks back
            if new_cunk.active {
                self.active_chunks.push(new_cunk.clone());
                self.add_chunk(new_cunk);
            }
        }

        self.iteration += 1;
    }

    pub fn add_chunk(&mut self, chunk: Chunk) {
        if chunk.active {
            let pos_x = chunk.pos_x;
            let pos_y = chunk.pos_y;
            self.active_chunks.push(chunk.clone());
            self.chunks.insert((pos_x, pos_y), chunk);

            let cached = [
                self.get_chunk(KeySimd(pos_x - 1, pos_y - 1)),
                self.get_chunk(KeySimd(pos_x, pos_y - 1)),
                self.get_chunk(KeySimd(pos_x + 1, pos_y - 1)),
                self.get_chunk(KeySimd(pos_x - 1, pos_y)),
                self.get_chunk(KeySimd(pos_x, pos_y)),
                self.get_chunk(KeySimd(pos_x + 1, pos_y)),
                self.get_chunk(KeySimd(pos_x - 1, pos_y + 1)),
                self.get_chunk(KeySimd(pos_x, pos_y + 1)),
                self.get_chunk(KeySimd(pos_x + 1, pos_y + 1)),
            ];

            for cached_chunk in cached {
                self.chunks
                    .insert((cached_chunk.pos_x, cached_chunk.pos_y), cached_chunk);
            }
        }
    }

    pub fn get_chunk(&self, key: KeySimd) -> Chunk {
        self.chunks
            .get(&(key.0, key.1))
            .unwrap_or(&Chunk::new(key.0, key.1))
            .clone()
    }

    pub fn flip_cell(&mut self, cell: CellID) {
        let mut chunk = self.get_chunk(KeySimd(cell.chunk_pos_x, cell.chunk_pos_y));
        chunk.flip_cell(cell.cell_index);

        if chunk.active {
            self.add_chunk(chunk);
        }
    }

    pub fn get_iteration(&self) -> u64 {
        self.iteration
    }

    pub fn get_active_chunks(&self) -> Vec<Chunk> {
        return self.active_chunks.to_vec();
    }
}

#[wasm_bindgen]
pub struct KeySimd(i32, i32);
