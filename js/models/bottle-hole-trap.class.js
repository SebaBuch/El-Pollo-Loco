/**
 * Trap that opens a hole when Pepe reaches the fleeing bottle.
 */
class BottleHoleTrap extends Trap {
    bottle;

    /**
     * Creates the trap for a bottle.
     * @param {FleeingBottle} bottle - The bottle that triggers the trap
     */
    constructor(bottle) {
        super(0);
        this.bottle = bottle;
    }

    /**
     * Checks if Pepe touches the bottle.
     * @param {Character} character - The playable character
     * @returns {boolean} True if the trap should trigger
     */
    shouldTrigger(character) {
        return character.isColliding(this.bottle);
    }

    /**
     * Opens a hole in front of the bottle.
     * @param {World} world - The game world
     */
    activate(world) {
        let hole = new Hole(this.bottle.x - 150, 160, 160);
        world.level.holes.push(hole);
    }
}