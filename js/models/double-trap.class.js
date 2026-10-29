class DoubleTrap extends Trap {
    decoys = [];
    decoyTime = 0;
    isPunished = false;

    shouldTrigger(character) {
        return character.x > this.triggerX && character.isAboveGround();
    }

    activate(world) {
        for (let i = 0; i < 4; i++) {
            let x = this.triggerX + 271 + i * 71;
            let chicken = new TrapChicken(x, 360, 0, false);
            this.decoys.push(chicken);
            world.level.enemies.push(chicken);
        }
        this.decoyTime = new Date().getTime();
    }

    check(world) {
        super.check(world);
        if (!this.isTriggered) {
            return;
        }
        let timepassed = new Date().getTime() - this.decoyTime;
        if (timepassed > 700) {
            this.removeDecoys();
        }
        if (timepassed < 1000 && this.isTurningInAir(world.character)) {
            this.punish(world);
        }
    }

    removeDecoys() {
        for (let i = 0; i < this.decoys.length; i++) {
            this.decoys[i].energy = 0;
        }
    }

    isTurningInAir(character) {
        return character.otherDirection && character.isAboveGround() && !this.isPunished;
    }

    punish(world) {
        this.isPunished = true;
        for (let i = 0; i < 2; i++) {
            let x = world.character.x - 30 - i * 71;
            let chicken = new TrapChicken(x, 360, 0, false);
            world.level.enemies.push(chicken);
        }
    }
}