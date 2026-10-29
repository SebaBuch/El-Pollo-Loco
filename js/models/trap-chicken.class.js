class TrapChicken extends Chicken {

    constructor(x, y, speed, isRunningRight) {
        super(x);
        this.y = y;
        this.speed = speed;
        this.otherDirection = isRunningRight;
        this.groundY = 360;
        this.applyGravity();
    }

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