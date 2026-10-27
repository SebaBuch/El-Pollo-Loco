class SmallChicken extends Chicken {
    y = 380;
    height = 50;
    width = 56;
    deathSound = SoundManager.sounds.smallChicken;
    offset = {
        top: 5,
        left: 5,
        right: 5,
        bottom: 5
    };

    IMAGES_WALKING = [
        'assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    constructor(x) {
        super(x);
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.speed = 1 + Math.random() * 0.8;
    }
}