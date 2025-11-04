use crate::tetromino::{Tetromino, TetrominoType};

pub struct TetrominoO {
    rotation: u8,
    position_x: i16,
    position_y: i16,
}

impl Tetromino for TetrominoO {
    fn get_type(&self) -> TetrominoType {
        TetrominoType::O
    }

    fn get_rotation(&self) -> u8 {
        0
    }

    fn get_position_x(&self) -> i16 {
        self.position_x
    }

    fn get_position_y(&self) -> i16 {
        self.position_y
    }

    fn set_rotation(&mut self, rotation: u8) {
        self.rotation = rotation;
    }

    fn set_position(&mut self, pos_x: i16, pos_y: i16) {
        self.position_x = pos_x;
        self.position_y = pos_y;
    }

    fn get(&self) -> Vec<char> {
        return vec!['O', 'O', 'O', 'O'];
    }

    fn get_size(&self) -> u8 {
        2
    }
}

impl TetrominoO {
    pub fn new() -> Self {
        Self {
            rotation: 0,
            position_x: 2,
            position_y: 0,
        }
    }
}
