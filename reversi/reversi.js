import init, { Board, CellState } from "./pkg/reversi.js";

let size = 8;
let board_size_x = 0;
let board_size_y = 0;
let board_pos_x = 0;
let board_pos_y = 0;
let cell_size = 0;
let play_bot = localStorage.getItem("bot");
console.log(play_bot);

let canvas = document.getElementById("canvas");
let ctx = setupCanvas(canvas);

function setupCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    board_size_y = canvas.height / size;
    cell_size = board_size_y / size * 4;

    board_size_x = board_size_y;
    board_pos_x = canvas.width / 2 - board_size_x - cell_size * 4;
    board_pos_y = cell_size;

    return ctx;
}

window.addEventListener("resize", () => {
    ctx = setupCanvas(canvas);
    draw();
});

await init();
let running = true;
let board = new Board(size);

let color = CellState.Red;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear
    ctx.fillStyle = "#69d4ffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < size * size; x++) {
        let row = Math.floor(x / size);
        let col = Math.floor(x % size);

        let cell = board.get_cell(row, col);

        ctx.beginPath();
        ctx.arc(board_pos_x + col * cell_size * 2, board_pos_y + row * cell_size * 2, cell_size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'brown';
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        if (cell.state == CellState.Green) {
            ctx.arc(board_pos_x + col * cell_size * 2, board_pos_y + row * cell_size * 2, cell_size, 0, Math.PI * 2, false);
            ctx.fillStyle = 'black';
        }

        if (cell.state == CellState.Red) {
            ctx.arc(board_pos_x + col * cell_size * 2, board_pos_y + row * cell_size * 2, cell_size, 0, Math.PI * 2, false);
            ctx.fillStyle = 'white';
        }
        ctx.fill();
        ctx.closePath();

        ctx.font = cell_size + "pt Arial";
        if (color == CellState.Green) {
            ctx.fillStyle = "black";
            ctx.fillText("blacks's turn", canvas.width / 30, canvas.height / 10);
        } else {
            ctx.fillStyle = "white";
            ctx.fillText("white's turn", canvas.width / 30, canvas.height / 10);
        }
    }
}

const mouse = {
    x: 0,
    y: 0,
    clicked: false
};

document.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

document.addEventListener("mouseup", () => {
    mouse.clicked = true;
});

let turn = 0;

localStorage.setItem("red", board.cells_of_color(CellState.Red));
localStorage.setItem("green", board.cells_of_color(CellState.Green));
localStorage.setItem("won", "You have cancelled the game");

function gameLoop() {

    if (running) {
        //check input
        //update game

        draw();

        if (board.skip_player(color)) {
            turn += 1

            if (turn % 2 == 0) {
                color = CellState.Red;
            } else {
                color = CellState.Green;
            }
        }

        if (board.game_over()) {
            running = false;
        }

        if (mouse.clicked) {
            let col = Math.floor((mouse.x - board_pos_x + cell_size) / board_size_x);
            let row = Math.floor((mouse.y - board_pos_y + cell_size) / board_size_y);

            let valid_move = (board.set_cell(row, col, color));
            if (valid_move) {
                turn += 1;
                if (turn % 2 == 0) {
                    color = CellState.Red;
                } else {
                    color = CellState.Green;
                }
            }

            mouse.clicked = false;
        }

        if (play_bot == "true") {
            if (color == CellState.Green) {
                let move = board.best_move(color);
                board.set_cell(move.row, move.col, color)
                turn += 1;

                if (turn % 2 == 0) {
                    color = CellState.Red;
                } else {
                    color = CellState.Green;
                }
            }
        }

        // if (color == CellState.Red) {
        //     let move = board.best_move(color);
        //     console.log(move);
        //     board.set_cell(move.row, move.col, color)
        //     turn += 1;

        //     if (turn % 2 == 0) {
        //         color = CellState.Red;
        //     } else {
        //         color = CellState.Green;
        //     }
        // }

        localStorage.setItem("red", board.cells_of_color(CellState.Red));
        localStorage.setItem("green", board.cells_of_color(CellState.Green));
        requestAnimationFrame(gameLoop); // schedule next frame
    } else {
        let red_cells = board.cells_of_color(CellState.Red);
        let green_cells = board.cells_of_color(CellState.Green);

        if (red_cells == green_cells) {
            localStorage.setItem("won", "Unentschieden");
        }

        if (red_cells > green_cells) {
            localStorage.setItem("won", "Weiss hat gewonnen");
        }

        if (red_cells < green_cells) {
            localStorage.setItem("won", "Schwarz hat gewonnen");
        }
        window.location.href = "over.html";
    }
}

gameLoop(); // start loop