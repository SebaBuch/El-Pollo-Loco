/**
 * Trap that shows chickens while Pepe jumps and punishes him if he turns around in the air.
 */
class DoubleTrap extends Trap {
    decoys = [];
    decoyTime = 0;
    isPunished = false;

    /**
     * Checks if Pepe jumps after the trigger position.
     * @param {Character} character - The playable character
     * @returns {boolean} True if the trap should trigger
     */
    shouldTrigger(character) {
        return character.x > this.triggerX && character.isAboveGround();
    }

    /**
     * Places four standing chickens in front of Pepe.
     * @param {World} world - The game world
     */
    activate(world) {
        for (let i = 0; i < 4; i++) {
            let x = this.triggerX + 271 + i * 71;
            let chicken = new TrapChicken(x, 360, 0, false);
            this.decoys.push(chicken);
            world.level.enemies.push(chicken);
        }
        this.decoyTime = new Date().getTime();
    }

    /**
     * Removes the decoys after a short time and punishes Pepe if he turns around.
     * @param {World} world - The game world
     */
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

    /**
     * Lets the four decoy chickens disappear.
     */
    removeDecoys() {
        for (let i = 0; i < this.decoys.length; i++) {
            this.decoys[i].energy = 0;
        }
    }

    /**
     * Checks if Pepe turns to the left while he is in the air.
     * @param {Character} character - The playable character
     * @returns {boolean} True if Pepe turns around in the air
     */
    isTurningInAir(character) {
        return character.otherDirection && character.isAboveGround() && !this.isPunished;
    }

    /**
     * Places two chickens under Pepe.
     * @param {World} world - The game world
     */
    punish(world) {
        this.isPunished = true;
        for (let i = 0; i < 2; i++) {
            let x = world.character.x - 30 - i * 71;
            let chicken = new TrapChicken(x, 360, 0, false);
            world.level.enemies.push(chicken);
        }
    }
}