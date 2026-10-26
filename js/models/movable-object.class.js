class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    groundY = 180;
    energy = 100;
    lastHit = 0;
    damage = 20;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
            this.stopAtGround();
        }, 1000 / 25);
    }

    stopAtGround() {
        if (!(this instanceof ThrowableObject) && this.y > this.groundY) {
            this.y = this.groundY;
            this.speedY = 0;
        }
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return !this.isSplashed;
        } else {
            return this.y < this.groundY;
        }
    }

    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

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

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    isDead() {
        return this.energy == 0;
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    playAnimationOnce(images) {
        if (this.currentImage < images.length) {
            let path = images[this.currentImage];
            this.img = this.imageCache[path];
            this.currentImage++;
        }
    }

    jump() {
        this.speedY = 25;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }
}