import Laser from "./laser.js";
import Ship from "./ship.js";
import settings from "./settings.js";
import GameObject from "./gameObject.js";
import ParticleEffect from "./particles.js";


class Game {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.score = 0;
        this.lives = 3;
        this.ship = new Ship(120, this.canvas.height / 2);
        this.lasers = [];
        this.targets = [];
        this.particleEffects = [];

        this.createEventListeners();
        this.spawnTargets();
    }

    createEventListeners() {
        window.addEventListener("keydown", ev => {
            if(ev.key === " ") {
                if(this.ship.isMoving) {
                    this.ship.isMoving = false;
                    this.ship.isPreppingFire = true;
                }
                else if(this.ship.isPreppingFire) {
                    this.ship.isPreppingFire = false;
                    this.ship.isFiring = true;
                }
            }
        });
    }

    spawnTargets() {
        const x = (Math.random() * this.canvas.width / 2) + this.canvas.width / 2;
        const y = Math.random() * this.canvas.height / 2;
        this.targets.push(new GameObject(x, y, 50, 50));
    }

    areObjectsColliding(obj1, obj2) {
        return (
            obj1.x + obj1.width > obj2.x
            && obj1.x < obj2.x + obj2.width
            && obj1.y + obj1.height > obj2.y
            && obj1.y < obj2.y + obj2.height
        );
    }

    checkCollisions() {
        // handle collisions between laser and target
        // this also checks for laser going off the screen
        let laserIndicesToRemove = [];
        let targetIndicesToRemove = [];

        for(let i = 0; i < this.lasers.length; i++) {
            for(let j = 0; j < this.targets.length; j++) {
                const laser = this.lasers[i];
                const target = this.targets[j];
                
                if(this.areObjectsColliding(laser, target)) {
                    this.score++;
                    laserIndicesToRemove.push(i);
                    targetIndicesToRemove.push(j);

                    // spawn a particle effect
                    this.particleEffects.push(new ParticleEffect(target.x + target.width / 2, target.y + target.height / 2));
                
                    // if a target was hit, go back to moving state and spawn a new target
                    this.ship.isWaitingShotResult = false;
                    this.ship.isMoving = true;
                    this.spawnTargets();
                }
                else if(laser.x > this.canvas.width) {
                    laserIndicesToRemove.push(i);
                }
            }
        }

        this.removeElementsFromArray(this.lasers, laserIndicesToRemove);
        this.removeElementsFromArray(this.targets, targetIndicesToRemove);
    }

    removeElementsFromArray(arr, indices) {
        for(let i = indices.length - 1; i >= 0; i--) {
            arr.splice(indices[i], 1);
        }
    }

    drawUi() {
        this.ctx.beginPath();
        this.ctx.fillStyle = "white";
        this.ctx.font = "18px Arial"
        this.ctx.fillText(`Score: ${this.score}`, 10, 20);
        this.ctx.fillText(`Lives: ${this.lives}`, 10, 50);
    }

    update() {
        this.ship.update();
        this.particleEffects.forEach(p => p.update());

        // remove completed effects
        this.particleEffects = this.particleEffects.filter(p => !p.isEffectComplete);
    
        // emit a laser if ship is firing
        if(this.ship.isFiring) {
            let laserHeight = settings.baseLaserHeight * (1 + (this.ship.firePowerLevel / 100));

            // bonus laser size for near perfect shots
            if(this.ship.firePowerLevel >= 95) {
                laserHeight *= 2;
            }

            const laserX = this.ship.x + this.ship.width;
            const laserY = (this.ship.y + (this.ship.height / 2)) - (laserHeight / 2)
            this.lasers.push(new Laser(laserX, laserY, laserHeight));
            this.ship.isFiring = false;
            this.ship.isWaitingShotResult = true;
        }

        this.lasers.forEach(l => l.update());

        // handle ship on edge of screen
        if(this.ship.y + this.ship.height >= this.canvas.height || this.ship.y <= 0) {
            this.ship.yVel *= -1;
        }

        this.checkCollisions();

        // if lasers are gone and there are still targets, the player missed. 
        // deduct a life and go back to moving state
        if(this.ship.isWaitingShotResult && this.lasers.length === 0 && this.targets.length > 0) {
            this.lives--;
            this.ship.isWaitingShotResult = false;
            this.ship.isMoving = true;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.ship.draw(this.ctx);
        this.lasers.forEach(l => l.draw(this.ctx));
        this.targets.forEach(t => t.draw(this.ctx));
        this.particleEffects.forEach(p => p.draw(this.ctx));

        this.drawUi();
    }
}

export default Game;
