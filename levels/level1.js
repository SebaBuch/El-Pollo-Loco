const level1 = new Level(
    [
        new Chicken(700),
        new SmallChicken(950),
        new Chicken(1200),
        new SmallChicken(1450),
        new Chicken(1700),
        new SmallChicken(1950),
        new Chicken(2200),
        new SmallChicken(2450),
        new Chicken(2700),
        new SmallChicken(2950),
        new Chicken(3200),
        new SmallChicken(3450),
        new Endboss()
    ],

    [
        new Cloud('assets/img/5_background/layers/4_clouds/1.png', 0),
        new Cloud('assets/img/5_background/layers/4_clouds/2.png', 853),
        new Cloud('assets/img/5_background/layers/4_clouds/1.png', 853 * 2),
        new Cloud('assets/img/5_background/layers/4_clouds/2.png', 853 * 3)
    ],

    [
        new BackgroundObject('assets/img/5_background/layers/air.png', -853),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', -853),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', -853),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', -853),
        new BackgroundObject('assets/img/5_background/layers/air.png', 0),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 0),
        new BackgroundObject('assets/img/5_background/layers/air.png', 853),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', 853),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', 853),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', 853),
        new BackgroundObject('assets/img/5_background/layers/air.png', 853 * 2),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 853 * 2),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 853 * 2),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 853 * 2),
        new BackgroundObject('assets/img/5_background/layers/air.png', 853 * 3),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', 853 * 3),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', 853 * 3),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', 853 * 3)
    ],

    [
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
    ]
);