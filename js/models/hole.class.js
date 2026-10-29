class Hole extends DrawableObject {
    y = 415;
    height = 65;
    homeX;
    normalWidth;
    grownWidth;
    growTime = 0;
    isTriggered = false;
    isLeftTriggered = false;
    growsLeftAfterFling = false;

    constructor(x, width, grownWidth) {
        super();
        this.x = x;
        this.homeX = x;
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
            this.growRight();
        } else if (this.shouldGrowLeft(character)) {
            this.growLeft();
        }
        let timepassed = new Date().getTime() - this.growTime;
        if (this.growTime > 0 && timepassed > 2000) {
            this.x = this.homeX;
            this.width = this.normalWidth;
        }
    }

    shouldGrow(character) {
        return !this.isTriggered && !character.wasFlung && this.isJumpingOver(character, 100);
    }

    shouldGrowLeft(character) {
        let canGrowLeft = this.growsLeftAfterFling && character.wasFlung;
        return !this.isLeftTriggered && canGrowLeft && this.isJumpingOver(character, 75);
    }

    isJumpingOver(character, distance) {
        let center = character.x + character.width / 2;
        let isJumping = character.isAboveGround() && !character.isFalling() && !character.isFlung;
        return isJumping && center > this.homeX + distance;
    }

    growRight() {
        this.isTriggered = true;
        this.width = this.grownWidth;
        this.growTime = new Date().getTime();
    }

    growLeft() {
        this.isLeftTriggered = true;
        this.x = this.homeX - 300;
        this.width = this.normalWidth + 300;
        this.growTime = new Date().getTime();
    }

    isUnder(character) {
        let center = character.x + character.width / 2;
        return center > this.x && center < this.x + this.width;
    }
}