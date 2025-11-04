use wasm_bindgen::prelude::wasm_bindgen;
use crate::grid::CellID;

use std::{
    ops::{BitOr, BitXor},
    simd::{simd_swizzle, u64x64},
};
const CHUNK_SIZE: u64 = 64;

use rustc_hash::FxHashMap;

#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct ChunkSimd {
    pos_x: i32,
    pos_y: i32,
    cells: u64x64,
    active: bool,
}

#[wasm_bindgen]
impl ChunkSimd {
    #[wasm_bindgen(constructor)]
    pub fn new(pos_x: i32, pos_y: i32) -> Self {
        let cells = u64x64::splat(0);

        Self {
            pos_x,
            pos_y,
            cells,
            active: false,
        }
    }
    fn compute_next(&self, cached: &[ChunkSimd; 9]) -> ChunkSimd {
        // convenience alias
        let c = &cached[4].cells;
        let n = &cached[1].cells;
        let s = &cached[7].cells;
        let w = &cached[3].cells;
        let e = &cached[5].cells;
        let nw = &cached[0].cells;
        let ne = &cached[2].cells;
        let sw = &cached[6].cells;
        let se = &cached[8].cells;

        // helpers: lane shifts (vertical)
        let north = shift_lanes_up(*c, *n);
        let south = shift_lanes_down(*c, *s);

        // bit shifts (horizontal)
        let west = (*c << 1) | left_border_from_chunks(*w);
        let east = (*c >> 1) | right_border_from_chunks(*e);

        // diagonal shifts
        let nw_bits = (north << 1) | left_border_from_chunks(*nw);
        let ne_bits = (north >> 1) | right_border_from_chunks(*ne);
        let sw_bits = (south << 1) | left_border_from_chunks(*sw);
        let se_bits = (south >> 1) | right_border_from_chunks(*se);

        // now we have all 8 neighbor bitmasks
        let dirs = [west, east, north, south, nw_bits, ne_bits, sw_bits, se_bits];

        // 3-bit neighbor counter
        let mut c0 = u64x64::splat(0);
        let mut c1 = u64x64::splat(0);
        let mut c2 = u64x64::splat(0);
        let mut c3 = u64x64::splat(0);

        for dir in dirs {
            let carry1 = c0 & dir;
            c0 ^= dir;

            let carry2 = c1 & carry1;
            c1 ^= carry1;

            let carry3 = c2 & carry2;
            c2 ^= carry2;

            c3 ^= carry3;
        }

        // apply rules: alive if count==3 or (count==2 and currently alive)
        let alive = *c;

        let is3 = (!c3) & (!c2) & c1 & c0;
        let is2 = (!c3) & (!c2) & c1 & (!c0);

        let next_cells = is3 | (is2 & alive);

        let active = next_cells.as_array().iter().sum::<u64>() != 0;

        ChunkSimd {
            pos_x: self.pos_x,
            pos_y: self.pos_y,
            cells: next_cells,
            active,
        }
    }

    pub fn set_cell_alive(&mut self, index: u64) {
        assert!(index < CHUNK_SIZE * CHUNK_SIZE);

        let row = index / CHUNK_SIZE;
        let col = index % CHUNK_SIZE;
        let row_cells = self.cells[row as usize].bitor(1 << col);
        self.cells[row as usize] = row_cells;

        self.active = true;
    }

    pub fn flip_cell(&mut self, index: u64) {
        assert!(index < CHUNK_SIZE * CHUNK_SIZE);

        let row = index / CHUNK_SIZE;
        let col = index % CHUNK_SIZE;
        let row_cells = self.cells[row as usize].bitxor(1 << col);
        self.cells[row as usize] = row_cells;

        self.active = false;
        for x in self.cells.to_array() {
            if x != 0 {
                self.active = true;
                break;
            }
        }
    }

    pub fn cell_alive(&self, index: u32) -> bool {
        //check if self is active if not there are no cells in the chunk
        if !self.active {
            return false;
        }

        assert!(index < (CHUNK_SIZE * CHUNK_SIZE) as u32);

        let row = index / CHUNK_SIZE as u32;
        let col = index % CHUNK_SIZE as u32;

        let cell = self.cells[row as usize] << CHUNK_SIZE - 1 - col as u64 >> CHUNK_SIZE - 1;

        return cell != 0;
    }

    pub fn cells(&self) -> Vec<u64> {
        self.cells.as_array().clone().to_vec()
    }

    pub fn active(&self) -> bool {
        self.active
    }

    pub fn get_pos_x(&self) -> i32 {
        self.pos_x
    }

    pub fn get_pos_y(&self) -> i32 {
        self.pos_y
    }
}

fn shift_lanes_up(center: u64x64, north: u64x64) -> u64x64 {
    const IDX: [usize; 64] = {
        let mut idx = [usize::MAX; 64];
        // idx[i] = i-1 for i>0 (row i becomes previous row)
        let mut i = 1;
        while i < 64 {
            idx[i] = i - 1;
            i += 1;
        }
        // idx[0] = lane 63 of `north` (last row of neighbor)
        idx[0] = 63 + 64; // from second vector in simd_swizzle!(a,b)
        idx
    };
    simd_swizzle!(center, north, IDX)
}

fn shift_lanes_down(center: u64x64, south: u64x64) -> u64x64 {
    const IDX: [usize; 64] = {
        let mut idx = [usize::MAX; 64];
        // idx[i] = i+1 for i<63
        let mut i = 0;
        while i < 63 {
            idx[i] = i + 1;
            i += 1;
        }
        // idx[63] = lane 0 of `south`
        idx[63] = 64; // lane 0 of second vector
        idx
    };
    simd_swizzle!(center, south, IDX)
}

fn left_border_from_chunks(left: u64x64) -> u64x64 {
    // Take the MSB of each row from the left neighbor and put it in as LSB
    let left_msb = left >> 63;
    let mask = u64x64::splat(1);
    left_msb & mask
}

fn right_border_from_chunks(right: u64x64) -> u64x64 {
    // Take the LSB of each row from the right neighbor and put it in as MSB
    let right_lsb = right & u64x64::splat(1);
    right_lsb << 63
}

#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct GridSimd {
    chunks: FxHashMap<(i32, i32), ChunkSimd>,
    active_chunks: Vec<ChunkSimd>,
    iteration: u64,
}

#[wasm_bindgen]
impl GridSimd {
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
            let pos_x = chunk.pos_x;
            let pos_y = chunk.pos_y;

            let cached = [
                self.get_chunk(Key {
                    x: pos_x - 1,
                    y: pos_y - 1,
                }),
                self.get_chunk(Key {
                    x: pos_x,
                    y: pos_y - 1,
                }),
                self.get_chunk(Key {
                    x: pos_x + 1,
                    y: pos_y - 1,
                }),
                self.get_chunk(Key {
                    x: pos_x - 1,
                    y: pos_y,
                }),
                self.get_chunk(Key { x: pos_x, y: pos_y }),
                self.get_chunk(Key {
                    x: pos_x + 1,
                    y: pos_y,
                }),
                self.get_chunk(Key {
                    x: pos_x - 1,
                    y: pos_y + 1,
                }),
                self.get_chunk(Key {
                    x: pos_x,
                    y: pos_y + 1,
                }),
                self.get_chunk(Key {
                    x: pos_x + 1,
                    y: pos_y + 1,
                }),
            ];

            let new_cunk = chunk.compute_next(&cached);

            //add all relevent chunks back
            if new_cunk.active {
                self.add_chunk(new_cunk);
            }
        }

        self.iteration += 1;
    }

    pub fn add_chunk(&mut self, chunk: ChunkSimd) {
        if chunk.active {
            let pos_x = chunk.pos_x;
            let pos_y = chunk.pos_y;
            self.active_chunks.push(chunk.clone());
            self.chunks.insert((pos_x, pos_y), chunk);

            let cached = [
                self.get_chunk(Key {
                    x: pos_x - 1,
                    y: pos_y - 1,
                }),
                self.get_chunk(Key {
                    x: pos_x,
                    y: pos_y - 1,
                }),
                self.get_chunk(Key {
                    x: pos_x + 1,
                    y: pos_y - 1,
                }),
                self.get_chunk(Key {
                    x: pos_x - 1,
                    y: pos_y,
                }),
                self.get_chunk(Key { x: pos_x, y: pos_y }),
                self.get_chunk(Key {
                    x: pos_x + 1,
                    y: pos_y,
                }),
                self.get_chunk(Key {
                    x: pos_x - 1,
                    y: pos_y + 1,
                }),
                self.get_chunk(Key {
                    x: pos_x,
                    y: pos_y + 1,
                }),
                self.get_chunk(Key {
                    x: pos_x + 1,
                    y: pos_y + 1,
                }),
            ];

            for cachde_chunk in cached {
                self.chunks
                    .insert((cachde_chunk.pos_x, cachde_chunk.pos_y), cachde_chunk);
            }
        }
    }

    pub fn get_chunk(&self, key: Key) -> ChunkSimd {
        self.chunks
            .get(&(key.x, key.y))
            .unwrap_or(&ChunkSimd::new(key.x, key.y))
            .clone()
    }

    pub fn flip_cell(&mut self, cell: CellID) {
        let mut chunk = self.get_chunk(Key {
            x: cell.chunk_pos_x,
            y: cell.chunk_pos_y,
        });
        chunk.flip_cell(cell.cell_index as u64);

        if chunk.active {
            self.add_chunk(chunk);
        }
    }

    pub fn get_iteration(&self) -> u64 {
        self.iteration
    }

    pub fn get_active_chunks(&self) -> Vec<ChunkSimd> {
        return self.active_chunks.to_vec();
    }
}

#[wasm_bindgen]
pub struct Key {
    x: i32,
    y: i32,
}
