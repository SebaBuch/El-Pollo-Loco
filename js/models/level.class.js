class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    traps;
    holes;
    level_end_x = 3600;

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