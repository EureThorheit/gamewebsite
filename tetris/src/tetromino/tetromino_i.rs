use crate::tetromino::{Tetromino, TetrominoType};

#[derive(Clone, Copy)]
pub struct TetrominoI {
    rotation: u8,
    position_x: i16,
    position_y: i16,
}

impl Tetromino for TetrominoI {
    fn get_type(&self) -> TetrominoType {
        TetrominoType::I
    }

    fn get_rotation(&self) -> u8 {
        self.rotation
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
        match self.rotation {
            1 => {
                return vec![
                    ' ', ' ', ' ', ' ', 'I', 'I', 'I', 'I', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
                ];
            }
            2 => {
                return vec![
                    ' ', 'I', ' ', ' ', ' ', 'I', ' ', ' ', ' ', 'I', ' ', ' ', ' ', 'I', ' ', ' ',
                ];
            }
            3 => {
                return vec![
                    ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'I', 'I', 'I', 'I', ' ', ' ', ' ', ' ',
                ]
            }

            _ => {
                vec![
                    ' ', ' ', 'I', ' ', ' ', ' ', 'I', ' ', ' ', ' ', 'I', ' ', ' ', ' ', 'I', ' ',
                ]
            }
        }
    }

    fn get_size(&self) -> u8 {
        4
    }
}

impl TetrominoI {
    pub fn new() -> Self {
        Self {
            rotation: 0,
            position_x: 2,
            position_y: 0,
        }
    }
}
