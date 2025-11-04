use crate::tetromino::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Grid {
    size_x: u32,
    size_y: u32,
    contents: Vec<char>,
    tetromino: Box<dyn Tetromino>,
    score: u32,
    level: u32,
    total_lines_cleared: u32,
    lines_for_next_level: i32,
}

#[wasm_bindgen]
impl Grid {
    #[wasm_bindgen(constructor)]
    pub fn new(size_x: u32, size_y: u32, tetromino_type: u32) -> Grid {
        let contents = vec![' ' as char; (size_x * size_y) as usize];

        let tetromino: Box<dyn Tetromino> = match tetromino_type {
            0 => Box::new(TetrominoI::new()),
            1 => Box::new(TetrominoT::new()),
            2 => Box::new(TetrominoO::new()),
            3 => Box::new(TetrominoS::new()),
            4 => Box::new(TetrominoZ::new()),
            5 => Box::new(TetrominoJ::new()),
            _ => Box::new(TetrominoL::new()),
        };

        Grid {
            size_x,
            size_y,
            contents,
            tetromino,
            score: 0,
            level: 1,
            total_lines_cleared: 0,
            lines_for_next_level: 10,
        }
    }

    pub fn move_tetromino_right(&mut self) {
        self.tetromino.move_right(self.size_x, &self.contents);
    }

    pub fn move_tetromino_left(&mut self) {
        self.tetromino.move_left(self.size_x, &self.contents);
    }

    //returns if lost
    pub fn move_tetromino_down(&mut self, new_tetromino: u32) -> bool {
        if !self
            .tetromino
            .move_down(self.size_x, self.size_y, &self.contents)
        {
            return self.checked_spawn(new_tetromino);
        }

        return true;
    }

    pub fn rotate_tetromino_right(&mut self) {
        self.tetromino
            .rotate_right(self.size_x, self.size_y, &self.contents);
    }
    pub fn rotate_tetromino_left(&mut self) {
        self.tetromino
            .rotate_left(self.size_x, self.size_y, &self.contents);
    }

    //returns if we lost where lost = false;
    pub fn checked_spawn(&mut self, tetromino: u32) -> bool {
        if !self
            .tetromino
            .move_down(self.size_x, self.size_y, &self.contents)
        {
            if !self.spawn_tetromino(tetromino) {
                return false;
            }
        }

        return true;
    }

    fn spawn_tetromino(&mut self, tetromino: u32) -> bool {
        let t_size: u32 = self.tetromino.get_size() as u32;
        let t_pos_x = self.tetromino.get_position_x();
        let t_pos_y: u32 = self.tetromino.get_position_y() as u32;

        for y in 0..t_size {
            for x in 0..t_size {
                if self.tetromino.get()[(y * t_size + x) as usize] != ' ' {
                    self.contents[((t_pos_y * self.size_x) as i16 + t_pos_x + (y * 10 + x) as i16)
                        as usize] = self.tetromino.get()[(y * t_size + x) as usize];
                }
            }
        }

        self.tetromino = random_tetromino(tetromino);

        if !self
            .tetromino
            .move_down(self.size_x, self.size_y, &self.contents)
        {
            println!("you have lost!\r");

            return false;
        }

        return true;
    }

    pub fn clear_line(&mut self) {
        let mut clear_count = 0;

        for y in (0..self.size_y).rev() {
            if !self.line_clear(y) {
                continue;
            }
            let row = (y * self.size_x) as usize..(y * self.size_x + self.size_x) as usize;
            for elem in self.contents[row].iter_mut() {
                *elem = ' ';
            }

            for row in (1..=y).rev() {
                for x in 0..self.size_x {
                    let dst = row * self.size_x + x;
                    let src = (row - 1) * self.size_x + x;
                    self.contents[dst as usize] = self.contents[src as usize];
                }
            }

            clear_count += 1;
        }

        if clear_count == 0 {
            return;
        }

        self.total_lines_cleared += clear_count;
        self.lines_for_next_level -= clear_count as i32;
        if self.lines_for_next_level <= 0 {
            self.level += 1;
            self.lines_for_next_level = 10 + self.lines_for_next_level;
        }

        match clear_count {
            1 => self.score += 100 * self.level,
            2 => self.score += 300 * self.level,
            3 => self.score += 500 * self.level,
            4 => self.score += 800 * self.level,
            _ => {}
        }
    }

    pub fn get_level(&self) -> u32 {
        self.level
    }

    pub fn get_score(&self) -> u32 {
        self.score
    }

    fn line_clear(&self, y: u32) -> bool {
        for x in 0..self.size_x {
            if self.contents[(y * self.size_x + x) as usize] == ' ' {
                return false;
            }
        }

        return true;
    }

    pub fn get_print(&self, index: usize) -> Print {
        let mut t_positions = Vec::<i32>::new();

        let t_size: u32 = self.tetromino.get_size() as u32;
        let t_pos_x: u32 = self.tetromino.get_position_x() as u32;
        let t_pos_y: u32 = self.tetromino.get_position_y() as u32;
        for y in 0..t_size {
            for x in 0..t_size {
                if self.tetromino.get()[(y * t_size + x) as usize] != ' ' {
                    t_positions.push(
                        t_pos_y as i32 * self.size_x as i32
                            + t_pos_x as i32
                            + (y * self.size_x + x) as i32,
                    );
                }
            }
        }

        let mut text = self.contents[index];

        let mut color = match text {
            'I' => TetrominoColor::LightBlue,
            'O' => TetrominoColor::Yellow,
            'T' => TetrominoColor::Purple,
            'S' => TetrominoColor::Green,
            'Z' => TetrominoColor::Red,
            'J' => TetrominoColor::Blue,
            'L' => TetrominoColor::Orange,
            _ => TetrominoColor::NONE,
        };

        for t_index in t_positions {
            if index == t_index as usize {
                color = self.tetromino.get_color();
            }
        }

        if color != TetrominoColor::NONE {
            text = '#';
        }

        let out = Print { color, text };

        return out;
    }
}

#[wasm_bindgen]
pub struct Print {
    pub color: TetrominoColor,
    pub text: char,
}
