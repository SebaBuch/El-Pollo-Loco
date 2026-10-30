/**
 * Handles throwing, buying and removing bottles.
 */
class BottleManager {
    world;
    lastThrow = 0;
    bottlePrice = 2;
    lastBuy = 0;

    /**
     * Creates the bottle manager.
     * @param {World} world - The game world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Runs all bottle checks in every frame.
     */
    checkBottles() {
        this.checkThrowObjects();
        this.checkBuyBottle();
        this.removeSplashedBottles();
    }

    /**
     * Throws a bottle when D is pressed.
     */
    checkThrowObjects() {
        if (this.world.keyboard.D && this.canThrow()) {
            this.throwBottle();
        }
    }

    /**
     * Checks if Pepe has a bottle and the last throw is long enough ago.
     * @returns {boolean} True if Pepe can throw
     */
    canThrow() {
        let timepassed = new Date().getTime() - this.lastThrow;
        return this.world.character.bottles > 0 && timepassed > 800 && !this.world.character.isDead();
    }

    /**
     * Creates a thrown bottle in front of Pepe.
     */
    throwBottle() {
        let direction = this.world.character.otherDirection;
        let x = direction ? this.world.character.x - 10 : this.world.character.x + 80;
        let bottle = new ThrowableObject(x, this.world.character.y + 100, direction);
        this.world.throwableObjects.push(bottle);
        SoundManager.playSound(SoundManager.sounds.throw);
        this.world.character.bottles--;
        this.world.updateBottleBar();
        this.lastThrow = new Date().getTime();
    }

    /**
     * Buys a bottle when B is pressed or plays an error sound.
     */
    checkBuyBottle() {
        if (!this.world.keyboard.B || !this.isBuyReady()) {
            return;
        }
        if (this.canBuyBottle()) {
            this.buyBottle();
        } else {
            SoundManager.playSound(SoundManager.sounds.buyError);
            this.lastBuy = new Date().getTime();
        }
    }

    /**
     * Checks if the last purchase is long enough ago.
     * @returns {boolean} True if Pepe can buy again
     */
    isBuyReady() {
        let timepassed = new Date().getTime() - this.lastBuy;
        return timepassed > 500 && !this.world.character.isDead();
    }

    /**
     * Checks if Pepe has enough coins and space for another bottle.
     * @returns {boolean} True if Pepe can buy a bottle
     */
    canBuyBottle() {
        let hasSpace = this.world.character.bottles < this.world.maxBottles;
        return this.world.character.coins >= this.bottlePrice && hasSpace;
    }

    /**
     * Exchanges coins for a bottle.
     */
    buyBottle() {
        this.world.character.coins -= this.bottlePrice;
        this.world.character.bottles++;
        this.world.updateCoinBar();
        this.world.updateBottleBar();
        SoundManager.playSound(SoundManager.sounds.bottleCollect);
        this.lastBuy = new Date().getTime();
    }

    /**
     * Removes every bottle whose splash animation is finished.
     */
    removeSplashedBottles() {
        for (let i = this.world.throwableObjects.length - 1; i >= 0; i--) {
            if (this.world.throwableObjects[i].isSplashFinished()) {
                this.world.throwableObjects.splice(i, 1);
            }
        }
    }
}