const finalScore = localStorage.getItem("tetrisScore") || 0;

let score_elem = document.getElementById("score");
let score = localStorage.getItem("tetrisScore");

score_elem.textContent = "Score: "+score;