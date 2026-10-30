/**
 * A normal chicken that walks to the left.
 */
class Chicken extends MovableObject {
    y = 360;
    height = 70;
    width = 71;
    deathSound = SoundManager.sounds.bigChicken;
    isTouchingCharacter = false;
    deathTime = 0;
    offset = {
        top: 5,
        left: 5,
        right: 5,
        bottom: 5
    };

    IMAGES_WALKING = [
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    /**
     * Loads the images, sets a random speed and starts the animations.
     * @param {number} x - Start position on the x axis
     */
    constructor(x) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x;
        this.speed = 0.5 + Math.random() * 0.7;
        this.animate();
    }

    /**
     * Starts the intervals for movement and animations.
     */
    animate() {
        startInterval(() => {
            this.moveChicken();
        }, 1000 / 60);

        startInterval(() => {
            this.playChickenAnimation();
        }, 100);
    }

    /**
     * Moves the chicken to the left while it is alive.
     */
    moveChicken() {
        if (!this.isDead()) {
            this.moveLeft();
        }
    }

    /**
     * Plays the walking or the dead animation.
     */
    playChickenAnimation() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
        } else if (this.speed > 0) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Kills the chicken and plays its death sound.
     */
    die() {
        this.energy = 0;
        this.deathTime = new Date().getTime();
        SoundManager.playSound(this.deathSound);
    }

    /**
     * Checks if the chicken has been dead for more than one second.
     * @returns {boolean} True if the chicken can be removed
     */
    isRemovable() {
        let timepassed = new Date().getTime() - this.deathTime;
        return this.isDead() && timepassed > 1000;
    }
}