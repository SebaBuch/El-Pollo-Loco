class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthBar = new StatusBar('health', 0, 100);
    coinBar = new StatusBar('coin', 45, 0);
    totalCoins = this.level.coins.lenght;
    throwableObjects = [];

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
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
        }, 1000 / 60);

        setInterval(() => {
            this.checkThrowObjects();
        }, 200);
    }

    checkThrowObjects() {
        if (this.keyboard.D) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkCoinCollisions();
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
        } else if (this.character.isColliding(enemy) && !this.character.isHurt()) {
            this.character.hit();
            this.healthBar.setPercentage(this.character.energy);
        }
    }

    checkCoinCollisions() {
        for (let i = 0; i < this.level.coins.length; i++) {
            if (this.character.isColliding(this.level.coins[i])) {
                this.level.coins.splice(i, 1);
                this.character.coins++;
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        requestAnimationFrame(() => {
            this.draw();
        });
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
        mo.drawFrame(this.ctx);
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