/**
 * Base class for every object that can be drawn on the canvas.
 */
class DrawableObject {
    static loadedImages = {};
    img;
    imageCache = {};
    currentImage = 0;
    x = 0;
    y = 0;
    height = 0;
    width = 0;
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    /**
     * Returns a cached image or creates and caches it, so every image is only loaded once.
     * @param {string} path - Path of the image file
     * @returns {HTMLImageElement} The cached image
     */
    static getImage(path) {
        if (!DrawableObject.loadedImages[path]) {
            let img = new Image();
            img.src = path;
            DrawableObject.loadedImages[path] = img;
        }
        return DrawableObject.loadedImages[path];
    }

    /**
     * Sets the current image of the object.
     * @param {string} path - Path of the image file
     */
    loadImage(path) {
        this.img = DrawableObject.getImage(path);
    }

    /**
     * Loads several images into the image cache of the object.
     * @param {string[]} arr - Paths of the image files
     */
    loadImages(arr) {
        for (let i = 0; i < arr.length; i++) {
            this.imageCache[arr[i]] = DrawableObject.getImage(arr[i]);
        }
    }

    /**
     * Draws the current image of the object.
     * @param {CanvasRenderingContext2D} ctx - Drawing context of the canvas
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}