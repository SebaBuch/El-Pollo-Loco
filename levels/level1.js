let currentLevel;

/**
 * Creates the level of the chosen difficulty.
 */
function initLevel() {
    if (difficulty == 'impossible') {
        currentLevel = createImpossibleLevel();
    } else {
        currentLevel = createEasyLevel();
    }
}

/**
 * Creates the easy level.
 * @returns {Level} The easy level
 */
function createEasyLevel() {
    return new Level(
        createEnemies(),
        createClouds(5),
        createBackgroundObjects(5),
        createCoins(),
        createBottles(),
        [],
        []
    );
}

/**
 * Creates the chickens and the endboss of the easy level.
 * @returns {MovableObject[]} All enemies
 */
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

/**
 * Creates the clouds.
 * @param {number} count - Number of clouds
 * @returns {Cloud[]} All clouds
 */
function createClouds(count) {
    let clouds = [];
    for (let i = 0; i < count; i++) {
        let imageNumber = i % 2 == 0 ? 1 : 2;
        clouds.push(new Cloud('assets/img/5_background/layers/4_clouds/' + imageNumber + '.png', 853 * i));
    }
    return clouds;
}

/**
 * Creates all background layers.
 * @param {number} count - Number of background parts
 * @returns {BackgroundObject[]} All background layers
 */
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

/**
 * Creates the coins of the easy level.
 * @returns {Coin[]} All coins
 */
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

/**
 * Creates the bottles of the easy level.
 * @returns {Bottle[]} All bottles
 */
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