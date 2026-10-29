class SkyChickenTrap extends Trap {

    activate(world) {
        let x = world.character.x + 180;
        let chicken = new TrapChicken(x, -100, 0.5, false);
        chicken.acceleration = 6;
        chicken.groundY = 1000;
        world.level.enemies.push(chicken);
    }
}