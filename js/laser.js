import GameObject from "./gameObject.js";
import settings from "./settings.js";

const LASER_WIDTH = 100;

class Laser extends GameObject {
    constructor(x, y, height) {
        super(x, y, LASER_WIDTH, height, settings.laserColor);
    }

    update() {
        this.x += settings.laserSpeed;
    }
}

export default Laser;
