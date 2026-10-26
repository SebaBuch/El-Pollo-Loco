class Coin extends MovableObject {
    width = 100;
    height = 100;
    offset = {
        top: 30,
        left: 30,
        right: 30,
        bottom: 30
    };

    IMAGES = [
        'assets/img/8_coin/coin_1.png',
        'assets/img/8_coin/coin_2.png'
    ];

    constructor(x, y) {
        super().loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.animate();
    }

    animate() {
        let animationId = setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 300);
        intervalIds.push(animationId);
    }
}