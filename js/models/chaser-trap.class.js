class ChaserTrap extends Trap {

    activate(world) {
        let x = world.character.x - 300;
        let chicken = new TrapChicken(x, 360, 8, true);
        world.level.enemies.push(chicken);
    }
}