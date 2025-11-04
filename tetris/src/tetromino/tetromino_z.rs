use crate::tetromino::{Tetromino, TetrominoType};

#[derive(Clone, Copy)]
pub struct TetrominoZ {
    rotation: u8,
    position_x: i16,
    position_y: i16,
}

impl Tetromino for TetrominoZ {
    fn get_type(&self) -> TetrominoType {
        TetrominoType::Z
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
                    ' ','Z',' ',
                    ' ','Z', 'Z',
                    ' ',' ', 'Z'
                ];


                
            }
            2 => {
                return vec![
                    ' ', ' ', ' ',
                    'Z', 'Z', ' ',
                    ' ', 'Z', 'Z',
                ]
            }
            3 => {
                return vec![
                    ' ', 'Z', ' ',
                    'Z', 'Z', ' ',
                    'Z', ' ', ' ',
                ]

            }

            _ => {
                return vec![
                    'Z','Z',' ',
                    ' ','Z','Z',
                    ' ',' ', ' '
                ];
                
            }
        }
    }

    fn get_size(&self) -> u8 {
        3
    }
}

impl TetrominoZ {
    pub fn new() -> Self {
        Self {
            rotation: 0,
            position_x: 2,
            position_y: 0,
        }
    }
}
