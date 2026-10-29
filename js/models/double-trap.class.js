class DoubleTrap extends Trap {

    shouldTrigger(character) {
        return character.x > this.triggerX && character.isAboveGround();
    }

    activate(world) {
        let x = world.character.x + 300;
        let chicken = new TrapChicken(x, 360, 6, false);
        world.level.enemies.push(chicken);
    }
}