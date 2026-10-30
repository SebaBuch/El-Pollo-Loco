/**
 * A salsa bottle that Pepe throws.
 */
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

    IMAGES_SPLASH = [
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /**
     * Creates the bottle and throws it.
     * @param {number} x - Start position on the x axis
     * @param {number} y - Start position on the y axis
     * @param {boolean} otherDirection - True if the bottle is thrown to the left
     */
    constructor(x, y, otherDirection) {
        super().loadImage(this.IMAGES_ROTATION[0]);
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.throw();
    }

    /**
     * Starts the flight and the animation of the bottle.
     */
    throw() {
        this.speedY = 20;
        this.applyGravity();
        startInterval(() => {
            this.moveBottle();
        }, 25);

        startInterval(() => {
            this.playBottleAnimation();
        }, 60);
    }

    /**
     * Moves the bottle and lets it splash when it hits the ground.
     */
    moveBottle() {
        if (this.isSplashed) {
            return;
        }
        this.moveInDirection();
        if (this.y >= 370) {
            this.splash();
        }
    }

    /**
     * Stops the bottle and starts the splash animation and sound.
     */
    splash() {
        this.isSplashed = true;
        this.speedY = 0;
        this.currentImage = 0;
        SoundManager.playSound(SoundManager.sounds.bottleSmash);
    }

    /**
     * Plays the rotation or the splash animation.
     */
    playBottleAnimation() {
        if (this.isSplashed) {
            this.playAnimationOnce(this.IMAGES_SPLASH);
        } else {
            this.playAnimation(this.IMAGES_ROTATION);
        }
    }

    /**
     * Checks if the splash animation is finished.
     * @returns {boolean} True if the bottle can be removed
     */
    isSplashFinished() {
        return this.isSplashed && this.currentImage >= this.IMAGES_SPLASH.length;
    }

    /**
     * Moves the bottle in the direction it was thrown.
     */
    moveInDirection() {
        if (this.otherDirection) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
    }
}