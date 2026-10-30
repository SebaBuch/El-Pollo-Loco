/**
 * Connects all game objects, runs the game loop and draws everything.
 */
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
    animationFrameId;
    isGameOver = false;
    wallTime = 0;
    collisions = new CollisionManager(this);
    bottleManager = new BottleManager(this);
    stats = {
        coins: 0,
        chickens: 0,
        frames: 0
    };

    /**
     * Creates the world and starts drawing and the game loop.
     * @param {HTMLCanvasElement} canvas - The game canvas
     * @param {Keyboard} keyboard - The pressed keys
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
        this.preloadBottleImages();
    }

    /**
     * Loads the bottle images before the first throw.
     */
    preloadBottleImages() {
        let bottle = new ThrowableObject(-1000, -1000, false);
        bottle.isSplashed = true;
    }

    /**
     * Gives Pepe and the endboss access to the world.
     */
    setWorld() {
        this.character.world = this;
        if (this.endboss) {
            this.endboss.world = this;
        }
    }

    /**
     * Finds the endboss in the enemies of the level.
     * @returns {Endboss} The endboss or undefined
     */
    findEndboss() {
        for (let i = 0; i < this.level.enemies.length; i++) {
            if (this.level.enemies[i] instanceof Endboss) {
                return this.level.enemies[i];
            }
        }
    }

    /**
     * Starts the alert of the endboss when Pepe comes close.
     */
    checkEndbossContact() {
        if (this.endboss && this.character.x > 2400 && !this.endboss.hadFirstContact) {
            this.endboss.startAlert();
        }
    }

    /**
     * Checks all traps, holes and fleeing bottles.
     */
    checkTraps() {
        if (!this.character.isFlung) {
            for (let i = 0; i < this.level.traps.length; i++) {
                this.level.traps[i].check(this);
            }
        }
        this.checkHoles();
        this.checkFleeingBottles();
    }

    /**
     * Lets every fleeing bottle run away from Pepe.
     */
    checkFleeingBottles() {
        for (let i = 0; i < this.level.bottles.length; i++) {
            let bottle = this.level.bottles[i];
            if (bottle instanceof FleeingBottle) {
                bottle.flee(this.character);
            }
        }
    }

    /**
     * Lets Pepe fall into holes and kills him when he falls out of the screen.
     */
    checkHoles() {
        for (let i = 0; i < this.level.holes.length; i++) {
            let hole = this.level.holes[i];
            hole.update(this.character);
            let isOnGround = this.character.isOnGround() && !this.character.isFlung;
            if (hole.isUnder(this.character) && isOnGround) {
                this.character.fallIntoHole();
            }
        }
        let isBelowScreen = this.character.y > 480;
        if (this.character.isFalling() && isBelowScreen && !this.character.isDead()) {
            this.damageCharacter(this.character.energy);
        }
    }

    /**
     * Starts the game loop with 60 checks per second.
     */
    run() {
        startInterval(() => {
            this.collisions.checkCollisions();
            this.bottleManager.checkBottles();
            this.checkEndbossContact();
            this.checkTraps();
            this.checkGoal();
            this.checkGameOver();
        }, 1000 / 60);
    }

    /**
     * Updates the goal flag and the invisible wall.
     */
    checkGoal() {
        let goal = this.level.goal;
        if (!goal || this.character.isFlung) {
            return;
        }
        goal.update(this.character);
        this.checkWallTime();
    }

    /**
     * Flings Pepe back to the start after one second at the wall.
     */
    checkWallTime() {
        if (this.character.x < this.level.level_end_x) {
            this.wallTime = 0;
            return;
        }
        if (this.wallTime == 0) {
            this.wallTime = new Date().getTime();
        }
        if (new Date().getTime() - this.wallTime > 1000) {
            this.character.flingToStart();
            this.level.goal.reset();
        }
    }

    /**
     * Ends the game when Pepe dies or the level is won.
     */
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

    /**
     * Checks if the level is won.
     * @returns {boolean} True if the level is won
     */
    isLevelWon() {
        if (this.endboss) {
            return this.endboss.isDead();
        }
        if (this.level.goal) {
            return this.character.isColliding(this.level.goal) && !this.character.isFlung;
        }
        return this.character.x >= this.level.level_end_x;
    }

    /**
     * Stops the game and shows the end after a short delay.
     * @param {boolean} isWon - True if the level was won
     */
    endGame(isWon) {
        this.isGameOver = true;
        if (!isWon && difficulty != 'impossible') {
            SoundManager.playSound(SoundManager.sounds.characterDies);
        }
        setTimeout(() => {
            handleGameEnd(isWon);
        }, 1500);
    }

    /**
     * Damages Pepe. In impossible mode every hit kills.
     * @param {number} damage - Amount of energy to remove
     */
    damageCharacter(damage) {
        if (difficulty == 'impossible') {
            damage = this.character.energy;
        }
        this.character.hit(damage);
        this.playHitSound();
        this.healthBar.setPercentage(this.character.energy);
    }

    /**
     * Plays the hit sound or the laughing in impossible mode.
     */
    playHitSound() {
        let isImpossible = difficulty == 'impossible';
        let sound = isImpossible ? SoundManager.sounds.laughing : SoundManager.sounds.characterHit;
        SoundManager.playSound(sound);
    }

    /**
     * Updates the coin bar.
     */
    updateCoinBar() {
        let percentage = this.character.coins / this.maxCoins * 100;
        this.coinBar.setPercentage(percentage);
    }

    /**
     * Updates the bottle bar.
     */
    updateBottleBar() {
        let percentage = this.character.bottles / this.maxBottles * 100;
        this.bottleBar.setPercentage(percentage);
    }

    /**
     * Draws the whole game in every frame.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let cameraX = Math.round(this.camera_x);
        this.ctx.translate(cameraX, 0);
        this.drawWorldObjects();
        this.ctx.translate(-cameraX, 0);
        this.drawStatusBars();
        this.animationFrameId = requestAnimationFrame(() => {
            this.draw();
        });
    }

    /**
     * Draws all objects that move with the camera.
     */
    drawWorldObjects() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.holes);
        this.addObjectsToMap(this.level.clouds);
        if (this.level.goal) {
            this.addToMap(this.level.goal);
        }
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
    }

    /**
     * Draws the status bars or the lives in impossible mode.
     */
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

    /**
     * Creates the heart icon for the lives.
     * @returns {DrawableObject} The heart icon
     */
    createLifeIcon() {
        let icon = new DrawableObject();
        icon.loadImage('assets/img/7_statusbars/3_icons/icon_health.png');
        icon.y = 10;
        icon.width = 40;
        icon.height = 40;
        return icon;
    }

    /**
     * Draws one heart for every remaining life.
     */
    drawLives() {
        for (let i = 0; i < lives; i++) {
            this.lifeIcon.x = 20 + i * 45;
            this.addToMap(this.lifeIcon);
        }
    }

    /**
     * Draws a list of objects.
     * @param {DrawableObject[]} objects - The objects to draw
     */
    addObjectsToMap(objects) {
        for (let i = 0; i < objects.length; i++) {
            this.addToMap(objects[i]);
        }
    }

    /**
     * Draws one object and mirrors it if needed.
     * @param {DrawableObject} mo - The object to draw
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Mirrors the canvas so the object looks to the left.
     * @param {DrawableObject} mo - The object to mirror
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Resets the canvas after drawing a mirrored object.
     * @param {DrawableObject} mo - The mirrored object
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}