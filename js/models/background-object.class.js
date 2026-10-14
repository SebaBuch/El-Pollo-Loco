class BackgroundObject extends MovableObject {

    width = 720;
    height = 400;
    constructor(imagePath) {
        super().loadImage(imagePath);
        this.y = y;
        this.x = x;
    }
}