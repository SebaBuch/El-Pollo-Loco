class Cloud extends MovableObject {
    y = 0;
    width = 853;
    height = 480;

    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.animate();
    }

    animate() {
        let moveId = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
        intervalIds.push(moveId);
    }
}