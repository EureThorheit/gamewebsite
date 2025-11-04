mod reversi;

// fn main() {
//     let size = 8;
//     let mut board = reversi::Board::new(size);

//     let moves = 60;
//     for x in 0..moves {
//         if x % 2 == 0 {
//             let best_move = board.best_move(reversi::CellState::Red);
//             board.set_cell(best_move, reversi::CellState::Red);
//         } else {
//             let best_move = board.best_move(reversi::CellState::Green);
//             board.set_cell(best_move, reversi::CellState::Green);
//         }
//     }

//     println!("{}", board);

//     println!(
//         "red_cells: {}",
//         board.cells_of_color(reversi::CellState::Green)
//     );
//     println!(
//         "green_cells: {}",
//         board.cells_of_color(reversi::CellState::Red)
//     );

//     //println!("best move:{:?}", best_move);
//     //board.set_cell(0, reversi::CellState::Green);
// }
