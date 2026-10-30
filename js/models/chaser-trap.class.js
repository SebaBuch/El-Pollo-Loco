/**
 * Trap that sends a fast chicken from behind.
 */
class ChaserTrap extends Trap {

    /**
     * Spawns a chicken behind Pepe that runs to the right.
     * @param {World} world - The game world
     */
    activate(world) {
        let x = world.character.x - 300;
        let chicken = new TrapChicken(x, 360, 8, true);
        world.level.enemies.push(chicken);
    }
}