class Character extends MovableObject {

    height = 250;
    width = 127;
    y = 180;
    x = 120;
    speed = 5;
    coins = 0;
    bottles = 0;
    lastMove = new Date().getTime();
    isInAir = false;
    cameraOffset = 100;
    lastDirection = false;
    directionStart = 0;
    offset = {
        top: 100,
        left: 20,
        right: 25,
        bottom: 10
    };

    IMAGES_IDLE = [
        'assets/img/2_character_pepe/1_idle/idle/I-1.png',
        'assets/img/2_character_pepe/1_idle/idle/I-2.png',
        'assets/img/2_character_pepe/1_idle/idle/I-3.png',
        'assets/img/2_character_pepe/1_idle/idle/I-4.png',
        'assets/img/2_character_pepe/1_idle/idle/I-5.png',
        'assets/img/2_character_pepe/1_idle/idle/I-6.png',
        'assets/img/2_character_pepe/1_idle/idle/I-7.png',
        'assets/img/2_character_pepe/1_idle/idle/I-8.png',
        'assets/img/2_character_pepe/1_idle/idle/I-9.png',
        'assets/img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        'assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    IMAGES_WALKING = [
        'assets/img/2_character_pepe/2_walk/W-21.png',
        'assets/img/2_character_pepe/2_walk/W-22.png',
        'assets/img/2_character_pepe/2_walk/W-23.png',
        'assets/img/2_character_pepe/2_walk/W-24.png',
        'assets/img/2_character_pepe/2_walk/W-25.png',
        'assets/img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'assets/img/2_character_pepe/3_jump/J-31.png',
        'assets/img/2_character_pepe/3_jump/J-32.png',
        'assets/img/2_character_pepe/3_jump/J-33.png',
        'assets/img/2_character_pepe/3_jump/J-34.png',
        'assets/img/2_character_pepe/3_jump/J-35.png',
        'assets/img/2_character_pepe/3_jump/J-36.png',
        'assets/img/2_character_pepe/3_jump/J-37.png',
        'assets/img/2_character_pepe/3_jump/J-38.png',
        'assets/img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_HURT = [
        'assets/img/2_character_pepe/4_hurt/H-41.png',
        'assets/img/2_character_pepe/4_hurt/H-42.png',
        'assets/img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_DEAD = [
        'assets/img/2_character_pepe/5_dead/D-51.png',
        'assets/img/2_character_pepe/5_dead/D-52.png',
        'assets/img/2_character_pepe/5_dead/D-53.png',
        'assets/img/2_character_pepe/5_dead/D-54.png',
        'assets/img/2_character_pepe/5_dead/D-55.png',
        'assets/img/2_character_pepe/5_dead/D-56.png',
        'assets/img/2_character_pepe/5_dead/D-57.png'
    ];

    world;

    constructor() {
        super().loadImage(this.IMAGES_IDLE[0]);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.applyGravity();
        this.animate();
    }

    animate() {
        startInterval(() => {
            this.moveCharacter();
        }, 1000 / 60);

        startInterval(() => {
            this.playCharacterAnimations();
        }, 100);
    }

    moveCharacter() {
        this.updateSounds();
        if (this.isDead()) {
            return;
        }
        this.walkRight();
        this.walkLeft();
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            SoundManager.playSound(SoundManager.sounds.jumping);
        }
        this.checkIfActive();
        this.updateCamera();
    }

    updateCamera() {
        this.updateCameraOffset();
        let targetX = -this.x + this.cameraOffset;
        this.world.camera_x += (targetX - this.world.camera_x) * 0.08;
    }

    updateCameraOffset() {
        if (difficulty == 'impossible') {
            this.cameraOffset = 175;
            return;
        }
        if (this.otherDirection != this.lastDirection) {
            this.directionStart = new Date().getTime();
            this.lastDirection = this.otherDirection;
        }
        let lookTime = new Date().getTime() - this.directionStart;
        if (lookTime > 600) {
            this.cameraOffset = this.otherDirection ? 493 : 100;
        }
    }
    stopAtGround() {
        super.stopAtGround();
        if (this.isAboveGround()) {
            this.isInAir = true;
        } else if (this.isInAir) {
            this.isInAir = false;
            SoundManager.playSound(SoundManager.sounds.landing);
        }
    }

    updateSounds() {
        this.updateWalkingSound();
        this.updateSnoringSound();
    }

    updateWalkingSound() {
        if (this.isWalking()) {
            SoundManager.playLoop(SoundManager.sounds.characterWalking);
        } else {
            SoundManager.sounds.characterWalking.pause();
        }
    }

    isWalking() {
        let keyboard = this.world.keyboard;
        return (keyboard.RIGHT || keyboard.LEFT) && !this.isAboveGround() && !this.isDead();
    }

    updateSnoringSound() {
        if (this.isSleeping() && !this.isDead()) {
            SoundManager.playLoop(SoundManager.sounds.snoring);
        } else {
            SoundManager.sounds.snoring.pause();
        }
    }

    walkRight() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
        }
    }

    walkLeft() {
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
        }
    }

    checkIfActive() {
        let keyboard = this.world.keyboard;
        if (keyboard.RIGHT || keyboard.LEFT || keyboard.SPACE || keyboard.D || keyboard.B) {
            this.lastMove = new Date().getTime();
        }
    }

    isSleeping() {
        let timepassed = new Date().getTime() - this.lastMove;
        return timepassed > 8000;
    }

    playCharacterAnimations() {
        if (this.isDead()) {
            this.playAnimationOnce(this.IMAGES_DEAD);
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
            this.lastMove = new Date().getTime();
        } else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        } else if (this.isSleeping()) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
        } else {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }

    isJumpingOn(enemy) {
        let characterBottom = this.y + this.height - this.offset.bottom;
        let enemyTop = enemy.y + enemy.offset.top;
        return this.isColliding(enemy) && this.speedY < 0 && characterBottom < enemyTop + 25;
    }

    bounce() {
        this.speedY = 15;
    }

    fallIntoHole() {
        this.groundY = 1000;
    }

    isFalling() {
        return this.groundY == 1000;
    }

    isInvulnerable() {
        return this.timeSinceLastHit() < 1500;
    }

    draw(ctx) {
        if (this.isBlinking()) {
            ctx.globalAlpha = 0.3;
        }
        super.draw(ctx);
        ctx.globalAlpha = 1;
    }

    isBlinking() {
        let isBlinkFrame = Math.floor(new Date().getTime() / 100) % 2 == 0;
        return this.isInvulnerable() && !this.isDead() && isBlinkFrame;
    }
}


