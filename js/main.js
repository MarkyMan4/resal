import Game from "./game.js";

const canvas = document.querySelector("#canvas");

let game = new Game(canvas);

function animate() {
    game.update();
    game.draw();

    setTimeout(() => requestAnimationFrame(animate), 1000 / 60);
}

animate();
