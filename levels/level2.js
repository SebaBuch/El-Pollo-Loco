function createImpossibleLevel() {
    return new Level(
        createImpossibleEnemies(),
        createClouds(),
        createBackgroundObjects(),
        createImpossibleCoins(),
        createImpossibleBottles(),
        createImpossibleTraps(),
        []
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
    let enemies = createSpecialChickens();
    for (let i = 0; i < 8; i++) {
        let x = 1800 + i * 220;
        if (i % 2 == 0) {
            enemies.push(new Chicken(x));
        } else {
            enemies.push(new SmallChicken(x));
        }
    }
    enemies.push(new Endboss());
    return enemies;
}


function createSpecialChickens() {
    let fastChicken = new Chicken(900);
    fastChicken.speed = 9;
    let guardChicken = new Chicken(2000);
    guardChicken.speed = 0;
    return [fastChicken, guardChicken];
}


function createImpossibleCoins() {
    return [
        new Coin(500, 280),
        new Coin(700, 170),
        new Coin(1250, 280),
        new Coin(1750, 170),
        new Coin(2050, 280),
        new Coin(2450, 170),
        new Coin(2550, 170),
        new Coin(2700, 280)
    ];
}


function createImpossibleBottles() {
    return [
        new Bottle(450),
        new Bottle(800),
        new Bottle(1200),
        new Bottle(1350),
        new Bottle(1800),
        new Bottle(2300),
        new Bottle(2550),
        new Bottle(2750)
    ];
}