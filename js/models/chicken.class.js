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

    constructor(x) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x;
        this.speed = 0.5 + Math.random() * 0.7;
        this.animate();
    }

    animate() {
        startInterval(() => {
            this.moveChicken();
        }, 1000 / 60);

        startInterval(() => {
            this.playChickenAnimation();
        }, 100);
    }

    moveChicken() {
        if (!this.isDead()) {
            this.moveLeft();
        }
    }

    playChickenAnimation() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    die() {
        this.energy = 0;
        this.deathTime = new Date().getTime();
        SoundManager.playSound(this.deathSound);
    }

    isRemovable() {
        let timepassed = new Date().getTime() - this.deathTime;
        return this.isDead() && timepassed > 1000;
    }
}