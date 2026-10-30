/**
 * Trap that sends a fast chicken over the ground when Pepe stands under a coin.
 */
class GroundChickenTrap extends AirChickenTrap {

    /**
     * Checks if Pepe stands on the ground under the coin.
     * @param {Character} character - The playable character
     * @returns {boolean} True if the trap should trigger
     */
    shouldTrigger(character) {
        let characterLeft = character.x + character.offset.left;
        let characterRight = character.x + character.width - character.offset.right;
        let coinLeft = this.coin.x + this.coin.offset.left;
        let coinRight = this.coin.x + this.coin.width - this.coin.offset.right;
        let isUnderCoin = characterRight > coinLeft - 5 && characterLeft < coinRight;
        return isUnderCoin && character.isOnGround();
    }

    /**
     * Spawns a fast chicken on the ground.
     * @param {World} world - The game world
     */
    activate(world) {
        let chicken = new TrapChicken(world.character.x + 580, 360, 40, false);
        world.level.enemies.push(chicken);
    }
}