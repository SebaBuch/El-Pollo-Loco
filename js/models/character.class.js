/**
 * The playable character Pepe.
 */
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
    isFlung = false;
    wasFlung = false;
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

    /**
     * Loads all images and starts gravity and animations.
     */
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

    /**
     * Starts the intervals for movement and animations.
     */
    animate() {
        startInterval(() => {
            this.moveCharacter();
        }, 1000 / 60);

        startInterval(() => {
            this.playCharacterAnimations();
        }, 100);
    }

    /**
     * Handles walking, jumping, the fling and the camera in every frame.
     */
    moveCharacter() {
        this.updateSounds();
        if (this.isDead()) {
            return;
        }
        if (this.isFlung) {
            this.updateFling();
            return;
        }
        this.walkRight();
        this.walkLeft();
        this.checkJump();
        this.checkIfActive();
        this.updateCamera();
    }

    /**
     * Starts a jump when space is pressed and Pepe stands on the ground.
     */
    checkJump() {
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            SoundManager.playSound(SoundManager.sounds.jumping);
        }
    }

    /**
     * Throws Pepe back to the start of the level.
     */
    flingToStart() {
        this.isFlung = true;
        this.wasFlung = true;
        this.speedY = 35;
    }

    /**
     * Moves Pepe back to the start while he is flung and lets the camera follow.
     */
    updateFling() {
        this.x -= 60;
        if (this.x <= 120) {
            this.x = 120;
            this.isFlung = false;
        }
        this.world.camera_x = -this.x + this.cameraOffset;
    }

    /**
     * Moves the camera smoothly towards Pepe.
     */
    updateCamera() {
        this.updateCameraOffset();
        let targetX = -this.x + this.cameraOffset;
        this.world.camera_x += (targetX - this.world.camera_x) * 0.08;
    }

    /**
     * Sets the camera position depending on the direction Pepe looks at.
     */
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

    /**
     * Stops Pepe at the ground and plays the landing sound after a jump.
     */
    stopAtGround() {
        super.stopAtGround();
        if (this.isAboveGround()) {
            this.isInAir = true;
        } else if (this.isInAir) {
            this.isInAir = false;
            SoundManager.playSound(SoundManager.sounds.landing);
        }
    }

    /**
     * Updates the walking and snoring sounds.
     */
    updateSounds() {
        this.updateWalkingSound();
        this.updateSnoringSound();
    }

    /**
     * Plays the walking sound while Pepe walks and pauses it otherwise.
     */
    updateWalkingSound() {
        if (this.isWalking()) {
            SoundManager.playLoop(SoundManager.sounds.characterWalking);
        } else {
            SoundManager.sounds.characterWalking.pause();
        }
    }

    /**
     * Checks if Pepe walks on the ground.
     * @returns {boolean} True if Pepe is walking
     */
    isWalking() {
        let keyboard = this.world.keyboard;
        return (keyboard.RIGHT || keyboard.LEFT) && !this.isAboveGround() && !this.isDead();
    }

    /**
     * Plays the snoring sound while Pepe sleeps and pauses it otherwise.
     */
    updateSnoringSound() {
        if (this.isSleeping() && !this.isDead()) {
            SoundManager.playLoop(SoundManager.sounds.snoring);
        } else {
            SoundManager.sounds.snoring.pause();
        }
    }

    /**
     * Moves Pepe to the right while the right arrow is pressed.
     */
    walkRight() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
        }
    }

    /**
     * Moves Pepe to the left while the left arrow is pressed.
     */
    walkLeft() {
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
        }
    }

    /**
     * Saves the time of the last key press.
     */
    checkIfActive() {
        let keyboard = this.world.keyboard;
        if (keyboard.RIGHT || keyboard.LEFT || keyboard.SPACE || keyboard.D || keyboard.B) {
            this.lastMove = new Date().getTime();
        }
    }

    /**
     * Checks if no key was pressed for more than 8 seconds.
     * @returns {boolean} True if Pepe is sleeping
     */
    isSleeping() {
        let timepassed = new Date().getTime() - this.lastMove;
        return timepassed > 8000;
    }

    /**
     * Chooses and plays the animation that fits the current state.
     */
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

    /**
     * Checks if Pepe lands on top of an enemy.
     * @param {MovableObject} enemy - The enemy to check
     * @returns {boolean} True if Pepe jumps on the enemy
     */
    isJumpingOn(enemy) {
        let characterBottom = this.y + this.height - this.offset.bottom;
        let enemyTop = enemy.y + enemy.offset.top;
        return this.isColliding(enemy) && this.speedY < 0 && characterBottom < enemyTop + 25;
    }

    /**
     * Lets Pepe bounce up after jumping on an enemy.
     */
    bounce() {
        this.speedY = 15;
    }

    /**
     * Checks if Pepe stands on the ground and is not starting a jump.
     * @returns {boolean} True if Pepe is on the ground
     */
    isOnGround() {
        return !this.isAboveGround() && this.speedY <= 0;
    }

    /**
     * Removes the ground under Pepe so he falls into a hole.
     */
    fallIntoHole() {
        this.groundY = 1000;
    }

    /**
     * Checks if Pepe falls into a hole.
     * @returns {boolean} True if Pepe is falling
     */
    isFalling() {
        return this.groundY == 1000;
    }

    /**
     * Checks if Pepe is protected after a hit.
     * @returns {boolean} True during 1.5 seconds after a hit
     */
    isInvulnerable() {
        return this.timeSinceLastHit() < 1500;
    }

    /**
     * Draws Pepe and lets him blink while he is protected.
     * @param {CanvasRenderingContext2D} ctx - Drawing context of the canvas
     */
    draw(ctx) {
        if (this.isBlinking()) {
            ctx.globalAlpha = 0.3;
        }
        super.draw(ctx);
        ctx.globalAlpha = 1;
    }

    /**
     * Checks if Pepe is shown transparent in the current blink frame.
     * @returns {boolean} True if Pepe is transparent
     */
    isBlinking() {
        let isBlinkFrame = Math.floor(new Date().getTime() / 100) % 2 == 0;
        return this.isInvulnerable() && !this.isDead() && isBlinkFrame;
    }
}