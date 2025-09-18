class Particle {
    constructor(x, y, color = "yellow") {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 2 + 10;
        this.xVel = Math.random() * 5 * (Math.random() < 0.5 ? 1 : -1);
        this.yVel = Math.random() * 5 * (Math.random() < 0.5 ? 1 : -1);
        this.decayRate = Math.random() * 0.4 + 0.2;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.x += this.xVel;
        this.y += this.yVel;
        this.radius -= this.decayRate;
    }
}

class ParticleEffect {
    constructor(x, y, numParticles = 10) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.isEffectComplete = false;

        for(let i = 0; i < numParticles; i++) {
            this.particles.push(new Particle(this.x, this.y));
        }
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }

    update() {
        const particleIndicesToRemove = [];
        this.particles.forEach((p, idx) => {
            p.update();
            if(p.radius < 0.2) {
                particleIndicesToRemove.push(idx);
            }
        });

        for(let i = particleIndicesToRemove.length - 1; i >= 0; i--) {
            this.particles.splice(particleIndicesToRemove[i], 1);
        }

        if(this.particles.length === 0) {
            this.isEffectComplete = true;
        }
    }
}

export default ParticleEffect;
