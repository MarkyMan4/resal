import GameObject from "./gameObject.js";
import settings from "./settings.js";

const SHIP_WIDTH = 100;
const SHIP_HEIGHT = 50;
const CANNON_WIDTH = 20;
const CANNON_HEIGHT = 5;
const FIREPOWER_METER_WIDTH = 50;
const FIREPOWER_METER_HEIGHT = 10;

class Ship extends GameObject {
    constructor(x, y) {
        super(x, y, SHIP_WIDTH - CANNON_WIDTH, SHIP_HEIGHT);
        this.yVel = settings.baseShipSpeed;
        // doin a poor man's state machine
        // could manage the different states in a better way but for now i dont care
        this.isMoving = true;
        this.isPreppingFire = false;
        this.isFiring = false;
        this.isWaitingShotResult = false;
        this.firePowerLevel = 0;
        this.firePowerMeterSpeed = settings.baseFirePowerMeterSpeed;
    }

    update() {
        if(this.isMoving) {
            this.y += this.yVel;
        }
        else if(this.isPreppingFire) {
            this.firePowerLevel += this.firePowerMeterSpeed;
            if(this.firePowerLevel >= 100 || this.firePowerLevel <= 0) {
                this.firePowerMeterSpeed *= -1;
            }
        }
    }

    draw(ctx) {
        super.draw(ctx);
        ctx.beginPath();
        ctx.rect(this.x + this.width, (this.y + this.height / 2) - (CANNON_HEIGHT / 2), CANNON_WIDTH, CANNON_HEIGHT);
        ctx.fillStyle = this.color;
        ctx.fill();

        if(this.isPreppingFire) {
            // draw fire power meter
            const meterPower = (this.firePowerLevel / 100) * FIREPOWER_METER_WIDTH;
            ctx.beginPath();
            ctx.rect(this.x + this.width + CANNON_WIDTH + 5, this.y + this.height / 2, meterPower, FIREPOWER_METER_HEIGHT);
            ctx.fillStyle = settings.powerMeterColor;
            ctx.fill();

            ctx.beginPath();
            ctx.rect(this.x + this.width + CANNON_WIDTH + 5, this.y + this.height / 2, FIREPOWER_METER_WIDTH, FIREPOWER_METER_HEIGHT);
            ctx.strokeStyle = settings.powerMeterOutlineColor;
            ctx.stroke();

        }
    }
}

export default Ship;
