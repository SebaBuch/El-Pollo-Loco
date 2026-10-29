class Chicken extends MovableObject {
    y = 360;
    height = 70;
    width = 71;
    deathSound = SoundManager.sounds.bigChicken;
    isTouchingCharacter = false;
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
        let moveId = setInterval(() => {
            if (!this.isDead()) {
                this.moveLeft();
            }
        }, 1000 / 60);

        let animationId = setInterval(() => {
            this.playChickenAnimation();
        }, 100);
        intervalIds.push(moveId, animationId);
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
        SoundManager.playSound(this.deathSound);
    }
}