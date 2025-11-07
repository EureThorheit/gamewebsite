let black_score = document.getElementById("black_score");
let white_score = document.getElementById("white_score");
let won = document.getElementById("won");
let player_won = localStorage.getItem("won");
let score = localStorage.getItem("tetrisScore");

let white_points = localStorage.getItem("red");
let black_points = localStorage.getItem("green");


black_score.textContent = "Black has: " + black_points + " points";
white_score.textContent = "White has: " + white_points + " points"
won.textContent = player_won;