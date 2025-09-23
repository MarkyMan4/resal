import Game from "./game.js";

const canvas = document.querySelector("#canvas");

let game = new Game(canvas);
game.run();
