let currentLevel;

function initLevel() {
    if (difficulty == 'impossible') {
        currentLevel = createImpossibleLevel();
    } else {
        currentLevel = createEasyLevel();
    }
}

function createEasyLevel() {
    return new Level(
        createEnemies(),
        createClouds(),
        createBackgroundObjects(5),
        createCoins(),
        createBottles(),
        [],
        []
    );
}

function createEnemies() {
    let enemies = [];
    for (let i = 0; i < 12; i++) {
        let x = 700 + i * 250;
        if (i % 2 == 0) {
            enemies.push(new Chicken(x));
        } else {
            enemies.push(new SmallChicken(x));
        }
    }
    enemies.push(new Endboss());
    return enemies;
}

function createClouds() {
    return [
        new Cloud('assets/img/5_background/layers/4_clouds/1.png', 0),
        new Cloud('assets/img/5_background/layers/4_clouds/2.png', 853),
        new Cloud('assets/img/5_background/layers/4_clouds/1.png', 853 * 2),
        new Cloud('assets/img/5_background/layers/4_clouds/2.png', 853 * 3),
        new Cloud('assets/img/5_background/layers/4_clouds/1.png', 853 * 4)
    ];
}

function createBackgroundObjects(count) {
    let backgroundObjects = [];
    for (let i = -1; i < count; i++) {
        let imageNumber = i % 2 == 0 ? 1 : 2;
        backgroundObjects.push(new BackgroundObject('assets/img/5_background/layers/air.png', 853 * i));
        backgroundObjects.push(new BackgroundObject('assets/img/5_background/layers/3_third_layer/' + imageNumber + '.png', 853 * i));
        backgroundObjects.push(new BackgroundObject('assets/img/5_background/layers/2_second_layer/' + imageNumber + '.png', 853 * i));
        backgroundObjects.push(new BackgroundObject('assets/img/5_background/layers/1_first_layer/' + imageNumber + '.png', 853 * i));
    }
    return backgroundObjects;
}

function createCoins() {
    return [
        new Coin(450, 280),
        new Coin(850, 170),
        new Coin(950, 170),
        new Coin(1350, 280),
        new Coin(1650, 170),
        new Coin(1750, 170),
        new Coin(2050, 280),
        new Coin(2350, 170),
        new Coin(2450, 170),
        new Coin(2650, 280)
    ];
}

function createBottles() {
    return [
        new Bottle(400),
        new Bottle(750),
        new Bottle(1050),
        new Bottle(1300),
        new Bottle(1550),
        new Bottle(1800),
        new Bottle(2000),
        new Bottle(2250),
        new Bottle(2500),
        new Bottle(2700)
    ];
}