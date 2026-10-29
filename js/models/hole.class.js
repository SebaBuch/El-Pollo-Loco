class Hole extends DrawableObject {
    y = 415;
    height = 65;
    grownWidth;
    isGrown = false;

    constructor(x, width, grownWidth) {
        super();
        this.x = x;
        this.width = width;
        this.grownWidth = grownWidth;
    }

    draw(ctx) {
        ctx.fillStyle = '#1e120a';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkGrow(character) {
        let center = character.x + character.width / 2;
        let isInFront = center > this.x - 200 && center < this.x;
        if (!this.isGrown && isInFront && character.isAboveGround()) {
            this.width = this.grownWidth;
            this.isGrown = true;
        }
    }

    isUnder(character) {
        let center = character.x + character.width / 2;
        return center > this.x && center < this.x + this.width;
    }
}