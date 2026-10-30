/**
 * A cloud that moves slowly to the left.
 */
class Cloud extends MovableObject {
    y = 0;
    width = 853;
    height = 480;

    /**
     * Creates the cloud and starts its movement.
     * @param {string} imagePath - Path of the cloud image
     * @param {number} x - Start position on the x axis
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.animate();
    }

    /**
     * Moves the cloud to the left in every frame.
     */
    animate() {
        startInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}