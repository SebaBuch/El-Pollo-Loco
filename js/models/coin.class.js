/**
 * A coin that Pepe can collect.
 */
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

    /**
     * Creates the coin and starts its animation.
     * @param {number} x - Position on the x axis
     * @param {number} y - Position on the y axis
     */
    constructor(x, y) {
        super().loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.animate();
    }

    /**
     * Plays the coin animation.
     */
    animate() {
        startInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 300);
    }
}