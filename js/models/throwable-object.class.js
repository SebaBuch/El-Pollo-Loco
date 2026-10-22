class ThrowableObject extends MovableObject {
    speed = 10;

    constructor(x, y, otherDirection) {
        super().loadImage('assets/img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.otherDirection = otherDirection;
        this.throw();
    }

    throw() {
        this.speedY = 20;
        this.applyGravity();
        setInterval(() => {
            this.moveInDirection();
        }, 25);
    }

    moveInDirection() {
        if (this.otherDirection) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
    }
}