// game object is always a rectangle to keep it simple
class GameObject {
    constructor(x, y, width, height, color = "white") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

export default GameObject;
