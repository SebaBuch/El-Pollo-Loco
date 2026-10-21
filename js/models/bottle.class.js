class Bottle extends DrawableObject {
    y = 350;
    width = 80;
    height = 80;
    offset = {
        top: 15,
        left: 25,
        right: 15,
        bottom: 5
    };

    IMAGES = [
        'assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor(x) {
        super();
        let imageIndex = Math.random() < 0.5 ? 0 : 1;
        this.loadImage(this.IMAGES[imageIndex]);
        this.x = x;
    }
}
