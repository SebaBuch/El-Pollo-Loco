function createImpossibleLevel() {
    return new Level(
        createImpossibleEnemies(),
        createClouds(),
        createBackgroundObjects(),
        [new BaitCoin(2200, 120)],
        [new FleeingBottle(1800, 500)],
        createImpossibleTraps(),
        [new Hole(1500, 120, 190)]
    );
}


function createImpossibleTraps() {
    return [
        new ChaserTrap(700),
        new SkyChickenTrap(1050),
        new DoubleTrap(1850)
    ];
}


function createImpossibleEnemies() {
    let fastChicken = new Chicken(900);
    fastChicken.speed = 9;
    let guardChicken = new Chicken(2000);
    guardChicken.speed = 0;
    return [fastChicken, guardChicken];
}