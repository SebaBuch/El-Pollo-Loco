class DrawableObject {
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

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        for (let i = 0; i < arr.length; i++) {
            let img = new Image();
            img.src = arr[i];
            this.imageCache[arr[i]] = img;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'red';
            ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.left - this.offset.right, this.height - this.offset.top - this.offset.bottom);
            ctx.stroke();
        }
    }
}