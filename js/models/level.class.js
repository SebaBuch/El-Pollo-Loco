/**
 * Holds all objects of one level.
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    traps;
    holes;
    goal;
    level_end_x = 3600;

    /**
     * Creates the level.
     * @param {MovableObject[]} enemies - All enemies
     * @param {Cloud[]} clouds - All clouds
     * @param {BackgroundObject[]} backgroundObjects - All background layers
     * @param {Coin[]} coins - All coins
     * @param {Bottle[]} bottles - All bottles
     * @param {Trap[]} traps - All traps
     * @param {Hole[]} holes - All holes
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles, traps, holes) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
        this.traps = traps;
        this.holes = holes;
    }
}