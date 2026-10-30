/**
 * A coin that can not be collected and lures Pepe into a trap.
 */
class BaitCoin extends Coin {
    isFakeAfterFling = true;

    /**
     * Checks if the coin can not be collected at the moment.
     * @param {Character} character - The playable character
     * @returns {boolean} True if the coin is fake
     */
    isFake(character) {
        return this.isFakeAfterFling || !character.wasFlung;
    }
}