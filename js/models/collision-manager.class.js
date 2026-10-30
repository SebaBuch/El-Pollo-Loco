/**
 * Checks all collisions between Pepe, enemies, coins and bottles.
 */
class CollisionManager {
    world;

    /**
     * Creates the collision manager.
     * @param {World} world - The game world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Runs all collision checks while Pepe is not flung.
     */
    checkCollisions() {
        if (this.world.character.isFlung) {
            return;
        }
        this.checkEnemyCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkBottleHits();
    }

    /**
     * Removes dead chickens and checks the contact with every living enemy.
     */
    checkEnemyCollisions() {
        if (this.world.character.isDead()) {
            return;
        }
        for (let i = this.world.level.enemies.length - 1; i >= 0; i--) {
            let enemy = this.world.level.enemies[i];
            if (enemy instanceof Chicken && enemy.isRemovable()) {
                this.world.level.enemies.splice(i, 1);
            } else if (!enemy.isDead()) {
                this.checkEnemyCollision(enemy);
            }
        }
    }

    /**
     * Checks if Pepe jumps on an enemy or touches it.
     * @param {MovableObject} enemy - The enemy to check
     */
    checkEnemyCollision(enemy) {
        if (enemy instanceof Chicken && difficulty != 'impossible' && this.world.character.isJumpingOn(enemy)) {
            enemy.die();
            this.world.character.bounce();
            this.world.stats.chickens++;
        } else if (this.world.character.isColliding(enemy)) {
            this.handleEnemyContact(enemy);
        } else {
            enemy.isTouchingCharacter = false;
        }
    }

    /**
     * Damages Pepe once per contact. The endboss can hit again every 3 seconds.
     * @param {MovableObject} enemy - The enemy that touches Pepe
     */
    handleEnemyContact(enemy) {
        let isNewContact = !enemy.isTouchingCharacter;
        enemy.isTouchingCharacter = true;
        if (this.world.character.isInvulnerable()) {
            return;
        }
        if (isNewContact || this.canEndbossHitAgain(enemy)) {
            this.world.damageCharacter(enemy.damage);
            this.pauseEndboss(enemy);
        }
    }

    /**
     * Lets the endboss pause after he hits Pepe.
     * @param {MovableObject} enemy - The enemy that hit Pepe
     */
    pauseEndboss(enemy) {
        if (enemy instanceof Endboss) {
            enemy.lastAttack = new Date().getTime();
        }
    }

    /**
     * Checks if the endboss may hit Pepe again during a long contact.
     * @param {MovableObject} enemy - The enemy that touches Pepe
     * @returns {boolean} True if the endboss can hit again
     */
    canEndbossHitAgain(enemy) {
        return enemy instanceof Endboss && this.world.character.timeSinceLastHit() >= 3000;
    }

    /**
     * Collects every coin Pepe touches, except bait coins.
     */
    checkCoinCollisions() {
        for (let i = this.world.level.coins.length - 1; i >= 0; i--) {
            let coin = this.world.level.coins[i];
            let isBait = coin instanceof BaitCoin && coin.isFake(this.world.character);
            if (!isBait && this.world.character.isColliding(coin)) {
                this.world.level.coins.splice(i, 1);
                this.world.character.coins++;
                this.world.stats.coins++;
                SoundManager.playSound(SoundManager.sounds.coin);
                this.world.updateCoinBar();
            }
        }
    }

    /**
     * Collects every bottle Pepe touches while he has space for it.
     */
    checkBottleCollisions() {
        for (let i = this.world.level.bottles.length - 1; i >= 0; i--) {
            let bottle = this.world.level.bottles[i];
            let hasSpace = this.world.character.bottles < this.world.maxBottles;
            let isTrap = bottle instanceof FleeingBottle;
            if (hasSpace && !isTrap && this.world.character.isColliding(bottle)) {
                this.world.level.bottles.splice(i, 1);
                this.world.character.bottles++;
                SoundManager.playSound(SoundManager.sounds.bottleCollect);
                this.world.updateBottleBar();
            }
        }
    }

    /**
     * Checks if a thrown bottle hits the endboss.
     */
    checkBottleHits() {
        if (!this.world.endboss) {
            return;
        }
        for (let i = 0; i < this.world.throwableObjects.length; i++) {
            let bottle = this.world.throwableObjects[i];
            if (!bottle.isSplashed && !this.world.endboss.isDead() && bottle.isColliding(this.world.endboss)) {
                this.hitEndbossWithBottle(bottle);
            }
        }
    }

    /**
     * Splashes the bottle and damages the endboss.
     * @param {ThrowableObject} bottle - The bottle that hit the endboss
     */
    hitEndbossWithBottle(bottle) {
        bottle.splash();
        if (this.world.endboss.isInvulnerable()) {
            return;
        }
        this.world.endboss.hit(bottle.damage);
        this.world.endbossBar.setPercentage(this.world.endboss.energy);
        if (!this.world.endboss.isDead()) {
            SoundManager.playSound(SoundManager.sounds.endbossHurt);
        }
    }
}