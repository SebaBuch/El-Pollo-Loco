class World {
    character = new Character();
    level = currentLevel;
    endboss = this.findEndboss();
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthBar = new StatusBar('health', 20, 0, 100);
    coinBar = new StatusBar('coin', 20, 45, 0);
    maxCoins = 10;
    bottleBar = new StatusBar('bottle', 20, 90, 0);
    maxBottles = 10;
    endbossBar = new StatusBar('endboss', 460, 0, 100);
    lifeIcon = this.createLifeIcon();
    throwableObjects = [];
    lastThrow = 0;
    bottlePrice = 2;
    lastBuy = 0;
    animationFrameId;
    isGameOver = false;
    stats = {
        coins: 0,
        chickens: 0,
        frames: 0
    };

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
        if (this.endboss) {
            this.endboss.world = this;
        }
    }

    findEndboss() {
        for (let i = 0; i < this.level.enemies.length; i++) {
            if (this.level.enemies[i] instanceof Endboss) {
                return this.level.enemies[i];
            }
        }
    }

    checkEndbossContact() {
        if (this.endboss && this.character.x > 2400 && !this.endboss.hadFirstContact) {
            this.endboss.startAlert();
        }
    }

    checkTraps() {
        for (let i = 0; i < this.level.traps.length; i++) {
            this.level.traps[i].check(this);
        }
        this.checkHoles();
        this.checkFleeingBottles();
    }

    checkFleeingBottles() {
        for (let i = 0; i < this.level.bottles.length; i++) {
            let bottle = this.level.bottles[i];
            if (bottle instanceof FleeingBottle) {
                bottle.flee(this.character);
            }
        }
    }

    checkHoles() {
        for (let i = 0; i < this.level.holes.length; i++) {
            let hole = this.level.holes[i];
            hole.checkGrow(this.character);
            if (hole.isUnder(this.character) && !this.character.isAboveGround()) {
                this.character.fallIntoHole();
            }
        }
        let isBelowScreen = this.character.y > 480;
        if (this.character.isFalling() && isBelowScreen && !this.character.isDead()) {
            this.damageCharacter(this.character.energy);
        }
    }

    spawnSkyChicken() {
        let x = this.character.x + 220;
        let chicken = new TrapChicken(x, -100, 0.5, false);
        this.level.enemies.push(chicken);
    }

    run() {
        startInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkBuyBottle();
            this.removeSplashedBottles();
            this.checkEndbossContact();
            this.checkTraps();
            this.checkGameOver();
        }, 1000 / 60);
    }

    checkGameOver() {
        if (this.isGameOver) {
            return;
        }
        this.stats.frames++;
        if (this.character.isDead()) {
            this.endGame(false);
        } else if (this.isLevelWon()) {
            this.endGame(true);
        }
    }

    isLevelWon() {
        if (this.endboss) {
            return this.endboss.isDead();
        }
        return this.character.x >= this.level.level_end_x;
    }

    endGame(isWon) {
        this.isGameOver = true;
        if (!isWon && difficulty != 'impossible') {
            SoundManager.playSound(SoundManager.sounds.characterDies);
        }
        setTimeout(() => {
            handleGameEnd(isWon);
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

    checkBuyBottle() {
        if (!this.keyboard.B || !this.isBuyReady()) {
            return;
        }
        if (this.canBuyBottle()) {
            this.buyBottle();
        } else {
            SoundManager.playSound(SoundManager.sounds.buyError);
            this.lastBuy = new Date().getTime();
        }
    }

    isBuyReady() {
        let timepassed = new Date().getTime() - this.lastBuy;
        return timepassed > 500 && !this.character.isDead();
    }

    canBuyBottle() {
        let hasSpace = this.character.bottles < this.maxBottles;
        return this.character.coins >= this.bottlePrice && hasSpace;
    }

    buyBottle() {
        this.character.coins -= this.bottlePrice;
        this.character.bottles++;
        this.updateCoinBar();
        this.updateBottleBar();
        SoundManager.playSound(SoundManager.sounds.bottleCollect);
        this.lastBuy = new Date().getTime();
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
        if (this.character.isDead()) {
            return;
        }
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            let enemy = this.level.enemies[i];
            if (enemy instanceof Chicken && enemy.isRemovable()) {
                this.level.enemies.splice(i, 1);
            } else if (!enemy.isDead()) {
                this.checkEnemyCollision(enemy);
            }
        }
    }

    checkEnemyCollision(enemy) {
        if (enemy instanceof Chicken && difficulty != 'impossible' && this.character.isJumpingOn(enemy)) {
            enemy.die();
            this.character.bounce();
            this.stats.chickens++;
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
        if (isNewContact || this.canEndbossHitAgain(enemy)) {
            this.damageCharacter(enemy.damage);
            this.pauseEndboss(enemy);
        }
    }

    pauseEndboss(enemy) {
        if (enemy instanceof Endboss) {
            enemy.lastAttack = new Date().getTime();
        }
    }

    canEndbossHitAgain(enemy) {
        return enemy instanceof Endboss && this.character.timeSinceLastHit() >= 3000;
    }

    damageCharacter(damage) {
        if (difficulty == 'impossible') {
            damage = this.character.energy;
        }
        this.character.hit(damage);
        this.playHitSound();
        this.healthBar.setPercentage(this.character.energy);
    }

    playHitSound() {
        let isImpossible = difficulty == 'impossible';
        let sound = isImpossible ? SoundManager.sounds.laughing : SoundManager.sounds.characterHit;
        SoundManager.playSound(sound);
    }

    checkCoinCollisions() {
        for (let i = this.level.coins.length - 1; i >= 0; i--) {
            let coin = this.level.coins[i];
            let isBait = coin instanceof BaitCoin;
            if (!isBait && this.character.isColliding(coin)) {
                this.level.coins.splice(i, 1);
                this.character.coins++;
                this.stats.coins++;
                SoundManager.playSound(SoundManager.sounds.coin);
                this.updateCoinBar();
            }
        }
    }

    updateCoinBar() {
        let percentage = this.character.coins / this.maxCoins * 100;
        this.coinBar.setPercentage(percentage);
    }

    checkBottleCollisions() {
        for (let i = this.level.bottles.length - 1; i >= 0; i--) {
            let hasSpace = this.character.bottles < this.maxBottles;
            if (hasSpace && this.character.isColliding(this.level.bottles[i])) {
                this.level.bottles.splice(i, 1);
                this.character.bottles++;
                SoundManager.playSound(SoundManager.sounds.bottleCollect);
                this.updateBottleBar();
            }
        }
    }

    updateBottleBar() {
        let percentage = this.character.bottles / this.maxBottles * 100;
        this.bottleBar.setPercentage(percentage);
    }

    checkBottleHits() {
        if (!this.endboss) {
            return;
        }
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
        this.addObjectsToMap(this.level.holes);
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
        if (difficulty == 'impossible') {
            this.drawLives();
            return;
        }
        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        if (this.endboss && this.endboss.hadFirstContact) {
            this.addToMap(this.endbossBar);
        }
    }

    createLifeIcon() {
        let icon = new DrawableObject();
        icon.loadImage('assets/img/7_statusbars/3_icons/icon_health.png');
        icon.y = 10;
        icon.width = 40;
        icon.height = 40;
        return icon;
    }

    drawLives() {
        for (let i = 0; i < lives; i++) {
            this.lifeIcon.x = 20 + i * 45;
            this.addToMap(this.lifeIcon);
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