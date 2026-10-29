function createImpossibleLevel() {
    let coins = createImpossibleCoins();
    let bottles = [new FleeingBottle(2800, 300)];
    let level = new Level(
        createImpossibleEnemies(),
        createClouds(),
        createBackgroundObjects(7),
        coins,
        bottles,
        createImpossibleTraps(coins, bottles),
        [new Hole(2100, 250, 450)]
    );
    level.level_end_x = 4500;
    return level;
}


function createImpossibleCoins() {
    return [
        new BaitCoin(1150, 120),
        new BaitCoin(1350, 120),
        new Coin(2550, 120)
    ];
}


function createImpossibleTraps(coins, bottles) {
    return [
        new ChaserTrap(650),
        new AirChickenTrap(coins[0]),
        new AirChickenTrap(coins[1]),
        new SkyChickenTrap(1650),
        new GroundChickenTrap(coins[2]),
        new BottleHoleTrap(bottles[0])
    ];
}


function createImpossibleEnemies() {
    let fastChicken = new Chicken(900);
    fastChicken.speed = 9;
    return [fastChicken];
}