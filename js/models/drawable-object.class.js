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

    static getImage(path) {
        if (!DrawableObject.loadedImages[path]) {
            let img = new Image();
            img.src = path;
            DrawableObject.loadedImages[path] = img;
        }
        return DrawableObject.loadedImages[path];
    }

    loadImage(path) {
        this.img = DrawableObject.getImage(path);
    }

    loadImages(arr) {
        for (let i = 0; i < arr.length; i++) {
            this.imageCache[arr[i]] = DrawableObject.getImage(arr[i]);
        }
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}