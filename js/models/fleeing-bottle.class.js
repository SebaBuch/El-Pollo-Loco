/**
 * A bottle that runs away from Pepe and can not be collected.
 */
class FleeingBottle extends Bottle {
    fleeDistance = 0;
    maxFleeDistance;

    /**
     * Creates the fleeing bottle.
     * @param {number} x - Position on the x axis
     * @param {number} maxFleeDistance - Maximum distance the bottle can run away
     */
    constructor(x, maxFleeDistance) {
        super(x);
        this.maxFleeDistance = maxFleeDistance;
    }

    /**
     * Moves the bottle away when Pepe comes close.
     * @param {Character} character - The playable character
     */
    flee(character) {
        let distance = this.x - character.x;
        let canFlee = this.fleeDistance < this.maxFleeDistance;
        if (distance > 0 && distance < 250 && canFlee) {
            this.x += 6;
            this.fleeDistance += 6;
        }
    }
}