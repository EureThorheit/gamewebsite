use crate::tetromino::{Tetromino, TetrominoType};

#[derive(Clone, Copy)]
pub struct TetrominoL {
    rotation: u8,
    position_x: i16,
    position_y: i16,
}

impl Tetromino for TetrominoL {
    fn get_type(&self) -> TetrominoType {
        TetrominoType::L
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
                    ' ','L',' ',
                    ' ','L', ' ',
                    ' ','L', 'L'
                ];


                
            }
            2 => {
                return vec![
                    ' ', ' ', 'L',
                    'L', 'L', 'L',
                    ' ', ' ', ' ',
                ]
            }
            3 => {
                return vec![
                    'L', 'L', ' ',
                    ' ', 'L', ' ',
                    ' ', 'L', ' ',
                ]

            }

            _ => {
                return vec![
                    ' ',' ',' ',
                    'L','L','L',
                    'L',' ', ' '
                ];
                
            }
        }
    }

    fn get_size(&self) -> u8 {
        3
    }
}

impl TetrominoL {
    pub fn new() -> Self {
        Self {
            rotation: 0,
            position_x: 2,
            position_y: 0,
        }
    }
}
