class GoalFlag extends DrawableObject {
    y = 60;
    width = 10;
    height = 355;
    homeX;
    fleeX;
    hasFled = false;

    constructor(homeX, fleeX) {
        super();
        this.x = homeX;
        this.homeX = homeX;
        this.fleeX = fleeX;
    }

    draw(ctx) {
        ctx.fillStyle = '#4a3020';
        ctx.fillRect(this.x - 15, this.y + this.height - 15, 40, 15);
        ctx.fillStyle = '#e8e8e8';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#d62828';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 10);
        ctx.lineTo(this.x - 90, this.y + 45);
        ctx.lineTo(this.x, this.y + 80);
        ctx.fill();
    }

    update(character) {
        if (this.x - character.x < 300) {
            this.hasFled = true;
        }
        let isAwayFromWall = character.x < this.fleeX - 215;
        if (this.hasFled && character.otherDirection && isAwayFromWall) {
            this.x -= 2;
        } else if (this.hasFled && this.x < this.fleeX) {
            this.x += 8;
        }
        if (this.x > this.fleeX) {
            this.x = this.fleeX;
        }
    }

    reset() {
        this.x = this.homeX;
        this.hasFled = false;
    }
}