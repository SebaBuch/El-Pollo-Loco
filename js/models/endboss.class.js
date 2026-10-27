class Endboss extends MovableObject {

    height = 400;
    width = 343;
    y = 30;
    speed = 1.5;
    damage = 40;
    hadFirstContact = false;
    firstContactTime = 0;
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

    animate() {
        let moveId = setInterval(() => {
            this.moveEndboss();
        }, 1000 / 60);

        let animationId = setInterval(() => {
            this.playEndbossAnimation();
        }, 150);
        intervalIds.push(moveId, animationId);
    }

    moveEndboss() {
        if (this.isDead() || this.isHurt() || !this.hadFirstContact || this.isAlerting()) {
            sounds.endbossWalks.pause();
            return;
        }
        playLoop(sounds.endbossWalks);
        this.walkTowardsCharacter();
    }

    startAlert() {
        this.hadFirstContact = true;
        this.firstContactTime = new Date().getTime();
        this.currentImage = 0;
        playSound(sounds.endbossFirstContact);
    }

    isAlerting() {
        let timepassed = new Date().getTime() - this.firstContactTime;
        return timepassed < 1500;
    }

    walkTowardsCharacter() {
        let characterCenter = this.world.character.x + this.world.character.width / 2;
        let endbossCenter = this.x + this.width / 2;
        this.speed = this.isAttacking() ? 4 : 1.5;
        if (characterCenter < endbossCenter) {
            this.moveLeft();
            this.otherDirection = false;
        } else {
            this.moveRight();
            this.otherDirection = true;
        }
    }

    isNearCharacter() {
        let characterCenter = this.world.character.x + this.world.character.width / 2;
        let endbossCenter = this.x + this.width / 2;
        return Math.abs(characterCenter - endbossCenter) < 300;
    }

    timeSinceLastHit() {
        return new Date().getTime() - this.lastHit;
    }

    isCounterAttacking() {
        return this.timeSinceLastHit() < 3000;
    }

    isInvulnerable() {
        return this.timeSinceLastHit() < 3000;
    }

    isAttacking() {
        return this.isNearCharacter() || this.isCounterAttacking();
    }

    playEndbossAnimation() {
        if (this.isDead()) {
            this.playAnimationOnce(this.IMAGES_DEAD);
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (!this.hadFirstContact || this.isAlerting()) {
            this.playAnimation(this.IMAGES_ALERT);
        } else if (this.isAttacking()) {
            this.playAnimation(this.IMAGES_ATTACK);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }
}