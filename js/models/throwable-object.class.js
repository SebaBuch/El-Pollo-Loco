class ThrowableObject extends MovableObject {
    width = 60;
    height = 60;
    speed = 10;
    offset = {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10
    };

    constructor(x, y, otherDirection) {
        super().loadImage('assets/img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
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