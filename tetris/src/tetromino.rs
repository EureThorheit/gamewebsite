mod tetromino_i;
mod tetromino_j;
mod tetromino_l;
mod tetromino_o;
mod tetromino_s;
mod tetromino_t;
mod tetromino_z;

pub use tetromino_i::TetrominoI;
pub use tetromino_j::TetrominoJ;
pub use tetromino_l::TetrominoL;
pub use tetromino_o::TetrominoO;
pub use tetromino_s::TetrominoS;
pub use tetromino_t::TetrominoT;
pub use tetromino_z::TetrominoZ;
use wasm_bindgen::prelude::wasm_bindgen;

pub(crate) enum TetrominoType {
    I,
    O,
    T,
    S,
    Z,
    J,
    L,
}

#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq, Eq)]
pub enum TetrominoColor {
    NONE,
    LightBlue,
    Yellow,
    Purple,
    Green,
    Red,
    Blue,
    Orange,
}

pub trait Tetromino {
    fn get_type(&self) -> TetrominoType;
    fn get_rotation(&self) -> u8;
    fn get_position_x(&self) -> i16;
    fn get_position_y(&self) -> i16;
    fn get_size(&self) -> u8;
    fn get_color(&self) -> TetrominoColor {
        match self.get_type() {
            TetrominoType::I => TetrominoColor::LightBlue,
            TetrominoType::O => TetrominoColor::Yellow,
            TetrominoType::T => TetrominoColor::Purple,
            TetrominoType::S => TetrominoColor::Green,
            TetrominoType::Z => TetrominoColor::Red,
            TetrominoType::J => TetrominoColor::Blue,
            TetrominoType::L => TetrominoColor::Orange,
        }
    }
    fn get(&self) -> Vec<char>;
    fn set_rotation(&mut self, rotation: u8);
    fn set_position(&mut self, pos_x: i16, pos_y: i16);

    fn rotate_left(&mut self, size_x: u32, size_y: u32, contents: &Vec<char>) {
        let t_size: u32 = self.get_size() as u32;
        let t_pos_x = self.get_position_x();
        let t_pos_y: u32 = self.get_position_y() as u32;

        let old_rotation = self.get_rotation();
        let rotation = self.get_rotation() + 1;

        self.set_rotation(rotation % 4);

        for y in 0..t_size {
            for x in 0..t_size {
                if self.get()[(y * t_size + x) as usize] != ' ' {
                    if contents
                        [((t_pos_y * size_x) as i16 + t_pos_x + (y * size_x + x) as i16) as usize]
                        != ' '
                    {
                        self.set_rotation(old_rotation);
                        return;
                    }

                    if t_pos_x + (x as i16) < 0 {
                        self.set_rotation(old_rotation);
                        return;
                    }

                    if t_pos_x + x as i16 + 1 > size_x as i16 {
                        self.set_rotation(old_rotation);
                        return;
                    }

                    if (t_pos_y * size_x) as i16 + t_pos_x + (y * size_x + x) as i16
                        > ((size_y - 1) * size_x) as i16
                    {
                        self.set_rotation(old_rotation);
                    }
                }
            }
        }
    }

    fn rotate_right(&mut self, size_x: u32, size_y: u32, contents: &Vec<char>) {
        let t_size: u32 = self.get_size() as u32;
        let t_pos_x = self.get_position_x();
        let t_pos_y: u32 = self.get_position_y() as u32;

        let old_rotation = self.get_rotation();
        let rotation = self.get_rotation();

        if rotation == 0 {
            self.set_rotation(3);
        } else {
            self.set_rotation(rotation - 1);
        }

        for y in 0..t_size {
            for x in 0..t_size {
                if self.get()[(y * t_size + x) as usize] != ' ' {
                    if contents
                        [((t_pos_y * size_x) as i16 + t_pos_x + (y * size_x + x) as i16) as usize]
                        != ' '
                    {
                        self.set_rotation(old_rotation);
                        return;
                    }

                    if t_pos_x + (x as i16) < 0 {
                        self.set_rotation(old_rotation);
                        return;
                    }

                    if t_pos_x + x as i16 + 1 > size_x as i16 {
                        self.set_rotation(old_rotation);
                        return;
                    }

                    if (t_pos_y * size_x) as i16 + t_pos_x + (y * size_x + x) as i16
                        > ((size_y - 1) * size_x) as i16
                    {
                        self.set_rotation(old_rotation);
                    }
                }
            }
        }
    }

    fn move_down(&mut self, size_x: u32, size_y: u32, contents: &Vec<char>) -> bool {
        let t_size: u32 = self.get_size() as u32;
        let t_pos_x = self.get_position_x();
        let t_pos_y: u32 = self.get_position_y() as u32;

        for y in 0..t_size {
            for x in 0..t_size {
                if self.get()[(y * t_size + x) as usize] != ' ' {
                    if (t_pos_y * size_x) as i16 + t_pos_x + ((y * size_x + x) as i16)
                        < (size_x * size_y - size_x) as i16
                    {
                        if contents[((t_pos_y * size_x) as i16
                            + t_pos_x
                            + (y * size_x + x) as i16
                            + size_x as i16) as usize]
                            != ' '
                        {
                            return false;
                        }
                    }

                    if (t_pos_y * size_x) as i16 + t_pos_x + (y * size_x + x) as i16
                        >= ((size_y - 1) * size_x) as i16
                    {
                        return false;
                    }
                }
            }
        }

        let pos_y = self.get_position_y();
        self.set_position(self.get_position_x(), pos_y + 1);
        return true;
    }

    fn move_left(&mut self, size_x: u32, contents: &Vec<char>) {
        let t_size: u32 = self.get_size() as u32;
        let t_pos_x = self.get_position_x();
        let t_pos_y: u32 = self.get_position_y() as u32;

        for y in 0..t_size {
            for x in 0..t_size {
                if self.get()[(y * t_size + x) as usize] != ' ' {
                    if contents[((t_pos_y * size_x) as i16 + t_pos_x + (y * size_x + x) as i16 - 1)
                        as usize]
                        != ' '
                    {
                        return;
                    }

                    if t_pos_x + x as i16 <= 0 {
                        return;
                    }
                }
            }
        }

        let pos_x = self.get_position_x();
        self.set_position(pos_x - 1, self.get_position_y())
    }

    fn move_right(&mut self, size_x: u32, contents: &Vec<char>) {
        let t_size: u32 = self.get_size() as u32;
        let t_pos_x = self.get_position_x();
        let t_pos_y: u32 = self.get_position_y() as u32;

        for y in 0..t_size {
            for x in 0..t_size {
                if self.get()[(y * t_size + x) as usize] != ' ' {
                    if contents[((t_pos_y * size_x) as i16 + t_pos_x + (y * size_x + x) as i16 + 1)
                        as usize]
                        != ' '
                    {
                        return;
                    }

                    if t_pos_x + x as i16 + 1 >= size_x as i16 {
                        return;
                    }
                }
            }
        }

        let pos_x = self.get_position_x();
        self.set_position(pos_x + 1, self.get_position_y())
    }
}

pub fn random_tetromino(rand: u32) -> Box<dyn Tetromino> {
    match rand {
        0 => Box::new(TetrominoI::new()),
        1 => Box::new(TetrominoT::new()),
        2 => Box::new(TetrominoO::new()),
        3 => Box::new(TetrominoS::new()),
        4 => Box::new(TetrominoZ::new()),
        5 => Box::new(TetrominoJ::new()),
        _ => Box::new(TetrominoL::new()),
    }
}