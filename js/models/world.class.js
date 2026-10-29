class World {
    character = new Character();
    level = level1;
    endboss = this.findEndboss();
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthBar = new StatusBar('health', 20, 0, 100);
    coinBar = new StatusBar('coin', 20, 45, 0);
    totalCoins = this.level.coins.length;
    bottleBar = new StatusBar('bottle', 20, 90, 0);
    totalBottles = this.level.bottles.length;
    endbossBar = new StatusBar('endboss', 460, 0, 100);
    throwableObjects = [];
    lastThrow = 0;
    animationFrameId;
    isGameOver = false;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.endboss.world = this;
    }

    findEndboss() {
        for (let i = 0; i < this.level.enemies.length; i++) {
            if (this.level.enemies[i] instanceof Endboss) {
                return this.level.enemies[i];
            }
        }
    }

    checkEndbossContact() {
        if (this.character.x > 2400 && !this.endboss.hadFirstContact) {
            this.endboss.startAlert();
        }
    }

    run() {
        let runId = setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
            this.removeSplashedBottles();
            this.checkEndbossContact();
            this.checkGameOver();
        }, 1000 / 60);
        intervalIds.push(runId);
    }

    checkGameOver() {
        if (this.isGameOver) {
            return;
        }
        if (this.character.isDead()) {
            this.endGame(false);
        } else if (this.endboss.isDead()) {
            this.endGame(true);
        }
    }

    endGame(isWon) {
        this.isGameOver = true;
        if (!isWon) {
            SoundManager.playSound(SoundManager.sounds.characterDies);
        }
        setTimeout(() => {
            showEndScreen(isWon);
        }, 1500);
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.canThrow()) {
            this.throwBottle();
        }
    }

    canThrow() {
        let timepassed = new Date().getTime() - this.lastThrow;
        return this.character.bottles > 0 && timepassed > 800 && !this.character.isDead();
    }

    throwBottle() {
        let direction = this.character.otherDirection;
        let x = direction ? this.character.x - 10 : this.character.x + 80;
        let bottle = new ThrowableObject(x, this.character.y + 100, direction);
        this.throwableObjects.push(bottle);
        SoundManager.playSound(SoundManager.sounds.throw);
        this.character.bottles--;
        this.updateBottleBar();
        this.lastThrow = new Date().getTime();
    }

    removeSplashedBottles() {
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            if (this.throwableObjects[i].isSplashFinished()) {
                this.throwableObjects.splice(i, 1);
            }
        }
    }

    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkBottleHits();
    }

    checkEnemyCollisions() {
        for (let i = 0; i < this.level.enemies.length; i++) {
            let enemy = this.level.enemies[i];
            if (!enemy.isDead()) {
                this.checkEnemyCollision(enemy);
            }
        }
    }

    checkEnemyCollision(enemy) {
        if (enemy instanceof Chicken && this.character.isJumpingOn(enemy)) {
            enemy.die();
            this.character.bounce();
        } else if (this.character.isColliding(enemy)) {
            this.handleEnemyContact(enemy);
        } else {
            enemy.isTouchingCharacter = false;
        }
    }

    handleEnemyContact(enemy) {
        let isNewContact = !enemy.isTouchingCharacter;
        enemy.isTouchingCharacter = true;
        if (this.character.isInvulnerable()) {
            return;
        }
        if (enemy instanceof Endboss || isNewContact) {
            this.damageCharacter(enemy.damage);
        }
    }

    damageCharacter(damage) {
        this.character.hit(damage);
        SoundManager.playSound(SoundManager.sounds.characterHit);
        this.healthBar.setPercentage(this.character.energy);
    }

    checkCoinCollisions() {
        for (let i = this.level.coins.length - 1; i >= 0; i--) {
            if (this.character.isColliding(this.level.coins[i])) {
                this.level.coins.splice(i, 1);
                this.character.coins++;
                SoundManager.playSound(SoundManager.sounds.coin);
                this.updateCoinBar();
            }
        }
    }

    updateCoinBar() {
        let percentage = this.character.coins / this.totalCoins * 100;
        this.coinBar.setPercentage(percentage);
    }

    checkBottleCollisions() {
        for (let i = this.level.bottles.length - 1; i >= 0; i--) {
            if (this.character.isColliding(this.level.bottles[i])) {
                this.level.bottles.splice(i, 1);
                this.character.bottles++;
                SoundManager.playSound(SoundManager.sounds.bottleCollect);
                this.updateBottleBar();
            }
        }
    }

    updateBottleBar() {
        let percentage = this.character.bottles / this.totalBottles * 100;
        this.bottleBar.setPercentage(percentage);
    }

    checkBottleHits() {
        for (let i = 0; i < this.throwableObjects.length; i++) {
            let bottle = this.throwableObjects[i];
            if (!bottle.isSplashed && !this.endboss.isDead() && bottle.isColliding(this.endboss)) {
                this.hitEndbossWithBottle(bottle);
            }
        }
    }

    hitEndbossWithBottle(bottle) {
        bottle.splash();
        if (this.endboss.isInvulnerable()) {
            return;
        }
        this.endboss.hit(bottle.damage);
        this.endbossBar.setPercentage(this.endboss.energy);
        if (!this.endboss.isDead()) {
            SoundManager.playSound(SoundManager.sounds.endbossHurt);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
        this.drawStatusBars();
        this.animationFrameId = requestAnimationFrame(() => {
            this.draw();
        });
    }

    drawStatusBars() {
        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        if (this.endboss.hadFirstContact) {
            this.addToMap(this.endbossBar);
        }
    }

    addObjectsToMap(objects) {
        for (let i = 0; i < objects.length; i++) {
            this.addToMap(objects[i]);
        }
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}