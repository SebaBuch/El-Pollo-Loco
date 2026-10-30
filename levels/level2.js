function createImpossibleLevel() {
    let coins = createImpossibleCoins();
    let bottles = [new FleeingBottle(2800, 300)];
    let level = new Level(
        createImpossibleEnemies(),
        createClouds(8),
        createBackgroundObjects(7),
        coins,
        bottles,
        createImpossibleTraps(coins, bottles),
        createImpossibleHoles()
    );
    level.level_end_x = 4500;
    level.goal = new GoalFlag(4300, 4615);
    return level;
}

function createImpossibleHoles() {
    let hole = new Hole(2100, 250, 450);
    hole.growsLeftAfterFling = true;
    return [hole];
}

function createImpossibleCoins() {
    let firstCoin = new BaitCoin(1150, 120);
    firstCoin.isFakeAfterFling = false;
    return [
        firstCoin,
        new BaitCoin(1350, 120),
        new Coin(2550, 120)
    ];
}

function createImpossibleTraps(coins, bottles) {
    return [
        new ChaserTrap(650),
        ...createFirstCoinTraps(coins[0]),
        new AirChickenTrap(coins[1]),
        new SkyChickenTrap(1650),
        new GroundChickenTrap(coins[2]),
        new BottleHoleTrap(bottles[0]),
        new DoubleTrap(3400)
    ];
}

function createFirstCoinTraps(coin) {
    let airTrap = new AirChickenTrap(coin);
    airTrap.phase = 'beforeFling';
    let groundTrap = new GroundChickenTrap(coin);
    groundTrap.phase = 'afterFling';
    return [airTrap, groundTrap];
}

function createImpossibleEnemies() {
    let fastChicken = new Chicken(900);
    fastChicken.speed = 9;
    let guardChicken = new Chicken(3600);
    guardChicken.speed = 0;
    return [fastChicken, guardChicken];
}