/**
 * The giant chicken at the end of the easy level.
 */
class Endboss extends MovableObject {

    height = 400;
    width = 343;
    y = 30;
    speed = 1.5;
    damage = 40;
    hadFirstContact = false;
    firstContactTime = 0;
    isTouchingCharacter = false;
    lastAttack = 0;
    world;
    offset = {
        top: 70,
        left: 25,
        right: 25,
        bottom: 15
    };

    IMAGES_WALKING = [
        'assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [
        'assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /**
     * Loads all images and starts the animations.
     */
    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 3000;
        this.animate();
    }

    /**
     * Starts the intervals for movement and animations.
     */
    animate() {
        startInterval(() => {
            this.moveEndboss();
        }, 1000 / 60);

        startInterval(() => {
            this.playEndbossAnimation();
        }, 150);
    }

    /**
     * Walks towards Pepe and plays the walking sound when the boss is allowed to move.
     */
    moveEndboss() {
        if (!this.canMove()) {
            SoundManager.sounds.endbossWalks.pause();
            return;
        }
        SoundManager.playLoop(SoundManager.sounds.endbossWalks);
        this.walkTowardsCharacter();
    }

    /**
     * Checks if the boss is allowed to move.
     * @returns {boolean} True if the boss can move
     */
    canMove() {
        if (this.isDead() || this.isHurt() || this.isPausing()) {
            return false;
        }
        let characterIsDead = this.world.character.isDead();
        return this.hadFirstContact && !this.isAlerting() && !characterIsDead;
    }

    /**
     * Checks if the boss pauses after an attack.
     * @returns {boolean} True during 2 seconds after an attack
     */
    isPausing() {
        let timepassed = new Date().getTime() - this.lastAttack;
        return timepassed < 2000;
    }

    /**
     * Starts the alert when Pepe comes close for the first time.
     */
    startAlert() {
        this.hadFirstContact = true;
        this.firstContactTime = new Date().getTime();
        this.currentImage = 0;
        SoundManager.playSound(SoundManager.sounds.endbossFirstContact);
    }

    /**
     * Checks if the alert after the first contact is still running.
     * @returns {boolean} True during the alert
     */
    isAlerting() {
        let timepassed = new Date().getTime() - this.firstContactTime;
        return timepassed < 1500;
    }

    /**
     * Moves the boss towards Pepe and turns him in the right direction.
     */
    walkTowardsCharacter() {
        let characterCenter = this.world.character.x + this.world.character.width / 2;
        let endbossCenter = this.x + this.width / 2;
        this.speed = this.isAttacking() ? 4 : 1.5;
        if (characterCenter < endbossCenter - 10) {
            this.moveLeft();
            this.otherDirection = false;
        } else if (characterCenter > endbossCenter + 10) {
            this.moveRight();
            this.otherDirection = true;
        }
    }

    /**
     * Checks if Pepe is closer than 300 pixels.
     * @returns {boolean} True if Pepe is near
     */
    isNearCharacter() {
        let characterCenter = this.world.character.x + this.world.character.width / 2;
        let endbossCenter = this.x + this.width / 2;
        return Math.abs(characterCenter - endbossCenter) < 300;
    }

    /**
     * Checks if the boss strikes back after a hit.
     * @returns {boolean} True during 3 seconds after a hit
     */
    isCounterAttacking() {
        return this.timeSinceLastHit() < 3000;
    }

    /**
     * Checks if the boss is protected after a hit.
     * @returns {boolean} True during 3 seconds after a hit
     */
    isInvulnerable() {
        return this.timeSinceLastHit() < 3000;
    }

    /**
     * Checks if the boss attacks.
     * @returns {boolean} True if the boss attacks
     */
    isAttacking() {
        return this.isNearCharacter() || this.isCounterAttacking();
    }

    /**
     * Chooses and plays the animation that fits the current state.
     */
    playEndbossAnimation() {
        if (this.isDead()) {
            this.playAnimationOnce(this.IMAGES_DEAD);
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (!this.hadFirstContact || this.isAlerting() || this.isPausing()) {
            this.playAnimation(this.IMAGES_ALERT);
        } else if (this.isAttacking()) {
            this.playAnimation(this.IMAGES_ATTACK);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }
}