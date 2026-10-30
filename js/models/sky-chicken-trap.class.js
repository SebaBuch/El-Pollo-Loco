/**
 * Trap that drops a chicken from the sky.
 */
class SkyChickenTrap extends Trap {

    /**
     * Spawns a chicken above Pepe that falls down quickly.
     * @param {World} world - The game world
     */
    activate(world) {
        let x = world.character.x + 180;
        let chicken = new TrapChicken(x, -100, 0.5, false);
        chicken.acceleration = 6;
        chicken.groundY = 1000;
        world.level.enemies.push(chicken);
    }
}