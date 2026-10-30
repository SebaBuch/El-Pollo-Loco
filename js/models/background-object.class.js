/**
 * One layer of the background.
 */
class BackgroundObject extends MovableObject {

    width = 853;
    height = 480;

    /**
     * Creates the background layer at the bottom of the canvas.
     * @param {string} imagePath - Path of the layer image
     * @param {number} x - Position on the x axis
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.y = 480 - this.height;
        this.x = x;
    }
}