import init, { Grid, TetrominoColor } from "./pkg/hello_wasm.js";

//tetris board is 20rows x 10cols

let score = 0;
let grid_canvas = document.getElementById("canvas");
let size_x = 10;
let size_y = 20;
let cell_size = 0;
let grid_size_x = 0;
let grid_size_y = 0;
let grid_pos_x = 0;
let grid_pos_y = 0;
let ctx = setupCanvas(grid_canvas);
const keys = {};
let last_time = performance.now();
let fps = 0;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function setupCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    grid_size_y = canvas.height / (size_y + 2);
    cell_size = grid_size_y;

    grid_size_x = canvas.width / size_y;
    grid_pos_x = canvas.width / 2 - grid_size_x - cell_size * 2;
    grid_pos_y = cell_size * 2;

    return ctx;
}

window.addEventListener("resize", () => {
    ctx = setupCanvas(grid_canvas);
    draw();
});

await init();
let grid = new Grid(size_x, size_y, getRandomInt(7));
let running = true;

function draw() {
    ctx.clearRect(0, 0, grid_canvas.width, grid_canvas.height); // clear
    ctx.fillStyle = "#00041cff";
    ctx.fillRect(0, 0, grid_canvas.width, grid_canvas.height);

    ctx.font = cell_size + "pt GameBoy";
    ctx.fillStyle = "white";
    ctx.fillText("*----------*", grid_pos_x - cell_size, grid_pos_y - cell_size);

    ctx.fillText("level" + grid.get_level(), grid_canvas.width / 30, grid_canvas.height / 10);

    for (let y = 0; y < 20; y++) {
        ctx.fillStyle = "white";
        ctx.fillText("-", grid_pos_x - cell_size, y * cell_size + grid_pos_y);
        for (let x = 0; x < size_x; x++) {
            let char = grid.get_print(y * size_x + x);

            if (char.color == TetrominoColor.Blue) ctx.fillStyle = "blue";
            if (char.color == TetrominoColor.Green) ctx.fillStyle = "green";
            if (char.color == TetrominoColor.LightBlue) ctx.fillStyle = "lightblue";
            if (char.color == TetrominoColor.NONE) ctx.fillStyle = "black";
            if (char.color == TetrominoColor.Orange) ctx.fillStyle = "orange";
            if (char.color == TetrominoColor.Purple) ctx.fillStyle = "purple";
            if (char.color == TetrominoColor.Red) ctx.fillStyle = "red";
            if (char.color == TetrominoColor.Yellow) ctx.fillStyle = "yellow";

            ctx.fillText(char.text, x * cell_size + grid_pos_x, y * cell_size + grid_pos_y);
        }
        ctx.fillStyle = "white";
        ctx.fillText("-", grid_pos_x + size_x * cell_size, y * cell_size + grid_pos_y);
    }

    ctx.fillStyle = "white";
    ctx.fillText("*----------*", grid_pos_x - cell_size, grid_pos_y + size_y * cell_size);
}

window.addEventListener("keydown", (e) => {
    keys[e.key] = true; // mark key as pressed
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false; // mark key as released
});

let x = 0;
let y = 0;
let timer = 0;

function gameLoop() {
    let current_time = performance.now();
    let delta = current_time - last_time
    last_time = current_time;
    fps = 1000 / delta;

    if (running) {
        let tetromino = getRandomInt(7);

        // check input
        if (keys["ArrowRight"] || keys["d"]) { grid.move_tetromino_right(); keys["ArrowRight"] = false; keys["d"] = false; }
        if (keys["ArrowLeft"] || keys["a"]) { grid.move_tetromino_left(); keys["ArrowLeft"] = false; keys["a"] = false; }
        if (keys["ArrowDown"] || keys["s"]) { running = grid.move_tetromino_down(tetromino); keys["ArrowDown"] = false; keys["s"] = false; }

        if (keys["e"]) { grid.rotate_tetromino_right(); keys["e"] = false; }
        if (keys["q"]) { grid.rotate_tetromino_left(); keys["q"] = false; }

        //update grid
        if (timer % (42 - Math.min(Math.floor(grid.get_level() * (60 / fps))), 29) == 0) {
            running = grid.move_tetromino_down(tetromino);
            grid.clear_line();

            timer = 0;
        }

        draw();

        timer += 1;
        requestAnimationFrame(gameLoop); // schedule next frame
    } else {
        localStorage.setItem("tetrisScore", grid.get_score());

        window.location.href = "over.html";
    }
}

gameLoop(); // start loop