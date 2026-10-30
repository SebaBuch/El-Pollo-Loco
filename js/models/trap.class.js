/**
 * Base class for all traps of the impossible level.
 */
class Trap {
    triggerX;
    isTriggered = false;
    phase = 'always';

    /**
     * Creates the trap.
     * @param {number} triggerX - Position on the x axis that triggers the trap
     */
    constructor(triggerX) {
        this.triggerX = triggerX;
    }

    /**
     * Activates the trap once when it is in the right phase and gets triggered.
     * @param {World} world - The game world
     */
    check(world) {
        let character = world.character;
        if (!this.isTriggered && this.isInPhase(character) && this.shouldTrigger(character)) {
            this.isTriggered = true;
            this.activate(world);
        }
    }

    /**
     * Checks if the trap is active before or after the fling.
     * @param {Character} character - The playable character
     * @returns {boolean} True if the trap is active
     */
    isInPhase(character) {
        if (this.phase == 'beforeFling') {
            return !character.wasFlung;
        }
        if (this.phase == 'afterFling') {
            return character.wasFlung;
        }
        return true;
    }

    /**
     * Checks if Pepe has passed the trigger position.
     * @param {Character} character - The playable character
     * @returns {boolean} True if the trap should trigger
     */
    shouldTrigger(character) {
        return character.x > this.triggerX;
    }

    /**
     * Starts the effect of the trap. Is overwritten by every trap.
     * @param {World} world - The game world
     */
    activate(world) {
    }
}