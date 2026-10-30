/**
 * A chicken that is spawned by a trap with a fixed position, speed and direction.
 */
class TrapChicken extends Chicken {

    /**
     * Creates the chicken and starts gravity.
     * @param {number} x - Start position on the x axis
     * @param {number} y - Start position on the y axis
     * @param {number} speed - Walking speed
     * @param {boolean} isRunningRight - True if the chicken runs to the right
     */
    constructor(x, y, speed, isRunningRight) {
        super(x);
        this.y = y;
        this.speed = speed;
        this.otherDirection = isRunningRight;
        this.groundY = 360;
        this.applyGravity();
    }

    /**
     * Moves the chicken in its direction while it is alive.
     */
    moveChicken() {
        if (this.isDead()) {
            return;
        }
        if (this.otherDirection) {
            this.moveRight();
        } else {
            this.moveLeft();
        }
    }
}