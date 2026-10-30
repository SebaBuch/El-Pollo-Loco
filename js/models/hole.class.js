/**
 * A hole in the ground that grows when Pepe jumps over it.
 */
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

    /**
     * Creates the hole.
     * @param {number} x - Position on the x axis
     * @param {number} width - Normal width
     * @param {number} grownWidth - Width after growing to the right
     */
    constructor(x, width, grownWidth) {
        super();
        this.x = x;
        this.homeX = x;
        this.width = width;
        this.normalWidth = width;
        this.grownWidth = grownWidth;
    }

    /**
     * Draws the hole as a dark rectangle.
     * @param {CanvasRenderingContext2D} ctx - Drawing context of the canvas
     */
    draw(ctx) {
        ctx.fillStyle = '#1e120a';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    /**
     * Lets the hole grow and resets it after 2 seconds.
     * @param {Character} character - The playable character
     */
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

    /**
     * Checks if the hole should grow to the right.
     * @param {Character} character - The playable character
     * @returns {boolean} True if the hole should grow
     */
    shouldGrow(character) {
        return !this.isTriggered && !character.wasFlung && this.isJumpingOver(character, 100);
    }

    /**
     * Checks if the hole should grow to the left after the fling.
     * @param {Character} character - The playable character
     * @returns {boolean} True if the hole should grow
     */
    shouldGrowLeft(character) {
        let canGrowLeft = this.growsLeftAfterFling && character.wasFlung;
        return !this.isLeftTriggered && canGrowLeft && this.isJumpingOver(character, 75);
    }

    /**
     * Checks if Pepe jumps over a point of the hole.
     * @param {Character} character - The playable character
     * @param {number} distance - Distance from the left edge of the hole
     * @returns {boolean} True if Pepe jumps over that point
     */
    isJumpingOver(character, distance) {
        let center = character.x + character.width / 2;
        let isJumping = character.isAboveGround() && !character.isFalling() && !character.isFlung;
        return isJumping && center > this.homeX + distance;
    }

    /**
     * Makes the hole wider to the right.
     */
    growRight() {
        this.isTriggered = true;
        this.width = this.grownWidth;
        this.growTime = new Date().getTime();
    }

    /**
     * Makes the hole wider to the left.
     */
    growLeft() {
        this.isLeftTriggered = true;
        this.x = this.homeX - 300;
        this.width = this.normalWidth + 300;
        this.growTime = new Date().getTime();
    }

    /**
     * Checks if the hole is under the center of Pepe.
     * @param {Character} character - The playable character
     * @returns {boolean} True if Pepe is above the hole
     */
    isUnder(character) {
        let center = character.x + character.width / 2;
        return center > this.x && center < this.x + this.width;
    }
}