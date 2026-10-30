/**
 * Base class for every object that can move, fall, get hit and play animations.
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    groundY = 180;
    energy = 100;
    lastHit = 0;
    damage = 20;

    /**
     * Lets the object fall or rise according to its vertical speed.
     */
    applyGravity() {
        startInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
            this.stopAtGround();
        }, 1000 / 25);
    }

    /**
     * Stops the object when it reaches its ground position.
     */
    stopAtGround() {
        if (!(this instanceof ThrowableObject) && this.y > this.groundY) {
            this.y = this.groundY;
            this.speedY = 0;
        }
    }

    /**
     * Checks if the object is in the air.
     * @returns {boolean} True if the object is above the ground
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return !this.isSplashed;
        } else {
            return this.y < this.groundY;
        }
    }

    /**
     * Checks if this object overlaps another object, using the offsets of both.
     * @param {MovableObject} mo - The other object
     * @returns {boolean} True if both objects collide
     */
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    /**
     * Reduces the energy of the object and saves the time of the hit.
     * @param {number} damage - Amount of energy to remove
     */
    hit(damage) {
        if (this.isDead()) {
            return;
        }
        this.energy -= damage;
        if (this.energy <= 0) {
            this.energy = 0;
            this.currentImage = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks if the object was hit during the last second.
     * @returns {boolean} True if the object is hurt
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    /**
     * Calculates the time since the last hit.
     * @returns {number} Time in milliseconds
     */
    timeSinceLastHit() {
        return new Date().getTime() - this.lastHit;
    }

    /**
     * Checks if the object has no energy left.
     * @returns {boolean} True if the object is dead
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Shows the next image of a looping animation.
     * @param {string[]} images - Paths of the animation images
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Shows the next image of an animation and stops at the last image.
     * @param {string[]} images - Paths of the animation images
     */
    playAnimationOnce(images) {
        if (this.currentImage < images.length) {
            let path = images[this.currentImage];
            this.img = this.imageCache[path];
            this.currentImage++;
        }
    }

    /**
     * Starts a jump. The jump is higher in impossible mode.
     */
    jump() {
        this.speedY = difficulty == 'impossible' ? 27.5 : 25;
    }

    /**
     * Moves the object to the right by its speed.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left by its speed.
     */
    moveLeft() {
        this.x -= this.speed;
    }
}