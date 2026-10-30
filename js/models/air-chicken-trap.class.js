/**
 * Trap that sends a fast chicken through the air when Pepe jumps for a coin.
 */
class AirChickenTrap extends Trap {
    coin;

    /**
     * Creates the trap for a coin.
     * @param {Coin} coin - The coin that triggers the trap
     */
    constructor(coin) {
        super(0);
        this.coin = coin;
    }

    /**
     * Checks if Pepe jumps up to the coin.
     * @param {Character} character - The playable character
     * @returns {boolean} True if the trap should trigger
     */
    shouldTrigger(character) {
        let characterLeft = character.x + character.offset.left;
        let characterRight = character.x + character.width - character.offset.right;
        let characterTop = character.y + character.offset.top;
        let coinLeft = this.coin.x + this.coin.offset.left;
        let coinRight = this.coin.x + this.coin.width - this.coin.offset.right;
        let coinBottom = this.coin.y + this.coin.height - this.coin.offset.bottom;
        let isNearCoin = characterRight > coinLeft - 5 && characterLeft < coinRight;
        return isNearCoin && characterTop < coinBottom + 5;
    }

    /**
     * Spawns a fast chicken at the height of Pepe.
     * @param {World} world - The game world
     */
    activate(world) {
        let y = world.character.y + 130;
        let chicken = new TrapChicken(world.character.x + 580, y, 30, false);
        chicken.groundY = y;
        world.level.enemies.push(chicken);
    }
}