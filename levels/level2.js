function createImpossibleLevel() {
    let coins = createBaitCoins();
    return new Level(
        createImpossibleEnemies(),
        createClouds(),
        createBackgroundObjects(),
        coins,
        [],
        createImpossibleTraps(coins),
        [new Hole(2100, 120, 450)]
    );
}


function createBaitCoins() {
    return [
        new BaitCoin(1150, 120),
        new BaitCoin(1350, 120)
    ];
}


function createImpossibleTraps(coins) {
    return [
        new ChaserTrap(650),
        new AirChickenTrap(coins[0]),
        new AirChickenTrap(coins[1]),
        new SkyChickenTrap(1650)
    ];
}


function createImpossibleEnemies() {
    let fastChicken = new Chicken(900);
    fastChicken.speed = 9;
    return [fastChicken];
}