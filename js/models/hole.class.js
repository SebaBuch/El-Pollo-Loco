class Hole extends DrawableObject {
    y = 415;
    height = 65;
    normalWidth;
    grownWidth;
    growTime = 0;
    isTriggered = false;

    constructor(x, width, grownWidth) {
        super();
        this.x = x;
        this.width = width;
        this.normalWidth = width;
        this.grownWidth = grownWidth;
    }

    draw(ctx) {
        ctx.fillStyle = '#1e120a';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(character) {
        if (this.shouldGrow(character)) {
            this.width = this.grownWidth;
            this.isTriggered = true;
            this.growTime = new Date().getTime();
        }
        let timepassed = new Date().getTime() - this.growTime;
        if (this.isTriggered && timepassed > 2000) {
            this.width = this.normalWidth;
        }
    }

    shouldGrow(character) {
        let center = character.x + character.width / 2;
        let isJumping = character.isAboveGround() && !character.isFalling();
        return !this.isTriggered && isJumping && center > this.x + 5;
    }

    isUnder(character) {
        let center = character.x + character.width / 2;
        return center > this.x && center < this.x + this.width;
    }
}