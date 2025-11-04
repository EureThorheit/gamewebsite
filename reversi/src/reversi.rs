use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CellState {
    Empty,
    Red,
    Green,
}

#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct Cell {
    pub state: CellState,
}

#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct Board {
    cells: Vec<Cell>,
    valid_moves_red: Vec<usize>,
    valid_moves_green: Vec<usize>,
    size: usize,
}

#[wasm_bindgen]
impl Board {
    #[wasm_bindgen(constructor)]
    pub fn new(size: usize) -> Self {
        let mut size = if size % 2 == 0 {
            size
        } else {
            println!("grid has not even number of cells");
            size + 1
        };

        if size < 4 {
            size = 4;
            println!("grid too small");
        }

        size += 2;

        let mut cells = Vec::with_capacity(size * size);
        for _ in 0..size * size {
            cells.push(Cell {
                state: CellState::Empty,
            });
        }

        let upper_middle = (size / 2) * size + size / 2;
        let lower_middle = (size / 2 - 1) * size + size / 2;
        cells[upper_middle].state = CellState::Red;
        cells[upper_middle - 1].state = CellState::Green;
        cells[lower_middle].state = CellState::Green;
        cells[lower_middle - 1].state = CellState::Red;

        let valid_moves_red = Vec::new();
        let valid_moves_green = Vec::new();

        let mut board = Self {
            cells,
            size: size,
            valid_moves_red,
            valid_moves_green,
        };

        board.update_valid_moves();
        return board;
    }

    pub fn get_cell(&self, row: usize, col: usize) -> Cell {
        let index = (row + 1) *self.size + col + 1;

        self.cells[index].clone()
    }

    fn get_row_cells(&self, index: usize) -> Vec<usize> {
        let row = index / self.size;
        let mut cells = Vec::with_capacity(self.size);

        for x in 0..self.size {
            cells.push(row * self.size + x);
        }

        return cells;
    }

    fn get_col_cells(&self, index: usize) -> Vec<usize> {
        let col = index % self.size;
        let mut cells = Vec::with_capacity(self.size);

        for x in 0..self.size {
            cells.push(col + x * self.size);
        }

        return cells;
    }

    fn get_anti_diag_cells(&self, index: usize) -> Vec<usize> {
        let mut row = index / self.size;
        let mut col = index % self.size;
        let diag_size = self.get_cell_count_diag((self.size - 1) + col - row);
        let mut cells = Vec::with_capacity(diag_size);

        let min = std::cmp::min(row, col);
        row -= min;
        col -= min;

        for _ in 0..diag_size {
            cells.push(row * self.size + col);

            col += 1;
            row += 1;
        }

        return cells;
    }

    fn get_diag_cells(&self, index: usize) -> Vec<usize> {
        let row = index / self.size;
        let col = index % self.size;
        let diag = row + col;

        // Compute start position (top-rightmost point of this diagonal)
        let start_row = if diag < self.size {
            0
        } else {
            diag + 1 - self.size
        };
        let start_col = if diag < self.size {
            diag
        } else {
            self.size - 1
        };

        // Compute diagonal length
        let diag_size = if diag < self.size {
            diag + 1
        } else {
            2 * self.size - 1 - diag
        };

        (0..diag_size)
            .map(|i| (start_row + i) * self.size + start_col - i)
            .collect()
    }

    fn get_cell_count_diag(&self, diag: usize) -> usize {
        std::cmp::min(std::cmp::min(diag + 1, 2 * self.size - 1 - diag), self.size)
    }

    fn valid_index(&self, index: usize) -> bool {
        let n = self.size;
        let row = index / n;
        let col = index % n;

        if row == 0 || col == 0 || row == n - 1 || col == n - 1 {
            return false;
        }

        return true;
    }

    fn check_cells(&self, cells: Vec<usize>, color: CellState) -> Vec<usize> {
        let mut checked_cells = Vec::new();
        for cell in cells {
            if self.cells[cell].state == color {
                break;
            }
            if self.cells[cell].state == CellState::Empty || !self.valid_index(cell) {
                return Vec::new();
            }
            checked_cells.push(cell);
        }

        return checked_cells;
    }

    fn get_flipped_cells(&self, cells: Vec<usize>, index: usize, color: CellState) -> Vec<usize> {
        let mut cells_in_front = self.check_cells(
            cells
                .clone()
                .into_iter()
                .filter_map(|x| {
                    if x > index {
                        return Some(x);
                    }
                    return None;
                })
                .collect(),
            color,
        );

        let mut cells = cells;
        cells.reverse();

        let mut cells_before = self.check_cells(
            cells
                .into_iter()
                .filter_map(|x| {
                    if x < index {
                        return Some(x);
                    }
                    return None;
                })
                .collect(),
            color,
        );

        let mut switched_cells = Vec::new();
        switched_cells.append(&mut cells_in_front);
        switched_cells.append(&mut cells_before);

        return switched_cells;
    }

    fn get_cells_to_flip(&self, index: usize, color: CellState) -> Vec<usize> {
        let mut cells_to_flip = self.get_flipped_cells(self.get_row_cells(index), index, color);
        cells_to_flip.append(&mut self.get_flipped_cells(self.get_col_cells(index), index, color));
        cells_to_flip.append(&mut self.get_flipped_cells(self.get_diag_cells(index), index, color));
        cells_to_flip.append(&mut self.get_flipped_cells(
            self.get_anti_diag_cells(index),
            index,
            color,
        ));
        cells_to_flip
    }

    fn filpp_cells(&mut self, index: usize, color: CellState) {
        for cell in self.get_cells_to_flip(index, color) {
            self.cells[cell].state = color;
        }
    }

    fn update_valid_moves(&mut self) {
        let mut valid_moves_red = Vec::new();
        let mut valid_moves_green = Vec::new();

        for cell in 0..self.size * self.size {
            if self.cells[cell].state == CellState::Empty {
                if !self.get_cells_to_flip(cell, CellState::Green).is_empty()
                    && self.valid_index(cell)
                {
                    valid_moves_green.push(cell);
                }

                if !self.get_cells_to_flip(cell, CellState::Red).is_empty()
                    && self.valid_index(cell)
                {
                    valid_moves_red.push(cell);
                }
            }
        }

        self.valid_moves_red = valid_moves_red;
        self.valid_moves_green = valid_moves_green;
    }

    fn get_valid_moves(&self, color: CellState) -> &Vec<usize> {
        match color {
            CellState::Empty => &self.valid_moves_red,
            CellState::Red => &self.valid_moves_red,
            CellState::Green => &self.valid_moves_green,
        }
    }

    pub fn set_cell(&mut self, row: usize, col: usize, color: CellState) -> bool {
        let index = (row + 1) *self.size + col + 1;
        //assert!(self.cells[index].state != color);
        if !self.get_valid_moves(color).contains(&index) {
            return false;
        }


        self.filpp_cells(index, color);
        self.cells[index].state = color;
        self.update_valid_moves();
        true
    }

    pub fn skip_player(&self, color: CellState) -> bool {
        if self.get_valid_moves(color).is_empty() {
            return true;
        }

        false
    }

    pub fn game_over(&self) -> bool {
        if self.valid_moves_green.is_empty() && self.valid_moves_red.is_empty() {
            return true;
        }

        false
    }

    pub fn cells_of_color(&self, color: CellState) -> usize {
        let mut cells = 0;
        for x in 0..self.size * self.size {
            if self.cells[x].state == color {
                cells += 1;
            }
        }

        cells
    }

    pub fn best_move(&self, color: CellState) -> Index {
        let valid = self.get_valid_moves(color);
        let mut most = 0;
        let mut best = Index{row: 0, col:0};
        for cell in valid.into_iter() {
            let mut branch = self.clone();
            let row = cell / self.size;
            let col = cell % self.size;

            branch.set_cell(row - 1, col - 1, color);

            if branch.cells_of_color(color) > most {
                most = branch.cells_of_color(color);
                best = Index{row: row - 1, col: col - 1};
            }
        }

        best
    }
}

#[wasm_bindgen]
pub struct Index{
    pub row: usize,
    pub col: usize,
}
