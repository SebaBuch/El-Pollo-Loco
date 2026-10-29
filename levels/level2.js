function createImpossibleLevel() {
    return new Level(
        createImpossibleEnemies(),
        createClouds(),
        createBackgroundObjects(),
        createImpossibleCoins(),
        createImpossibleBottles(),
        [],
        []
    );
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
    let fastChicken = new Chicken(1500);
    fastChicken.speed = 15;
    return [fastChicken];
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