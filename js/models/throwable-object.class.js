class ThrowableObject extends MovableObject {
    width = 60;
    height = 60;
    speed = 10;
    isSplashed = false;
    offset = {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10
    };

    IMAGES_ROTATION = [
        'assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    constructor(x, y, otherDirection) {
        super().loadImage(this.IMAGES_ROTATION[0]);
        this.loadImages(this.IMAGES_ROTATION);
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.throw();
    }

    throw() {
        this.speedY = 20;
        this.applyGravity();
        setInterval(() => {
            this.moveBottle();
        }, 25);

        setInterval(() => {
            this.playAnimation(this.IMAGES_ROTATION);
        }, 60);
    }

    moveBottle() {
        if (this.isSplashed) {
            return;
        }
        this.moveInDirection();
        if (this.y >= 370) {
            this.splash();
        }
    }

    splash() {
        this.isSplashed = true;
        this.speedY = 0;
    }

    moveInDirection() {
        if (this.otherDirection) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
    }
}