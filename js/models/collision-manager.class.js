class CollisionManager {
    world;

    constructor(world) {
        this.world = world;
    }

    checkCollisions() {
        if (this.world.character.isFlung) {
            return;
        }
        this.checkEnemyCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkBottleHits();
    }

    checkEnemyCollisions() {
        if (this.world.character.isDead() || this.world.character.isFlung) {
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

    pauseEndboss(enemy) {
        if (enemy instanceof Endboss) {
            enemy.lastAttack = new Date().getTime();
        }
    }

    canEndbossHitAgain(enemy) {
        return enemy instanceof Endboss && this.world.character.timeSinceLastHit() >= 3000;
    }

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