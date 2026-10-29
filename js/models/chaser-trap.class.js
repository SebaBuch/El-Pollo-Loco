class ChaserTrap extends Trap {

    activate(world) {
        let x = world.character.x - 450;
        let chicken = new TrapChicken(x, 360, 7, true);
        world.level.enemies.push(chicken);
    }
}