class BackgroundObject extends MovableObject {

    width = 720;
    height = 480;
    constructor(imagePath) {
        super().loadImage(imagePath);
        this.y = 400 - this.height;
        this.x = x;
    }
}