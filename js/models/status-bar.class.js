/**
 * A status bar for health, coins, bottles or the endboss.
 */
class StatusBar extends DrawableObject {
    IMAGES_HEALTH = [
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    IMAGES_COIN = [
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
    ];

    IMAGES_BOTTLE = [
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
    ];

    IMAGES_ENDBOSS = [
        'assets/img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'assets/img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'assets/img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'assets/img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'assets/img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'assets/img/7_statusbars/2_statusbar_endboss/orange/orange100.png'
    ];

    IMAGES;
    percentage = 100;

    /**
     * Creates the status bar.
     * @param {string} type - Type of the bar: 'health', 'coin', 'bottle' or 'endboss'
     * @param {number} x - Position on the x axis
     * @param {number} y - Position on the y axis
     * @param {number} percentage - Start value in percent
     */
    constructor(type, x, y, percentage) {
        super();
        this.IMAGES = this.selectImages(type);
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 53;
        this.setPercentage(percentage);
    }

    /**
     * Chooses the images that belong to the type of the bar.
     * @param {string} type - Type of the bar
     * @returns {string[]} Paths of the bar images
     */
    selectImages(type) {
        if (type == 'coin') {
            return this.IMAGES_COIN;
        } else if (type == 'bottle') {
            return this.IMAGES_BOTTLE;
        } else if (type == 'endboss') {
            return this.IMAGES_ENDBOSS;
        }
        return this.IMAGES_HEALTH;
    }

    /**
     * Updates the bar to a new value.
     * @param {number} percentage - New value in percent
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Finds the image that fits the current percentage.
     * @returns {number} Index of the image
     */
    resolveImageIndex() {
        if (this.percentage >= 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}