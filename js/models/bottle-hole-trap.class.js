class BottleHoleTrap extends Trap {
    bottle;

    constructor(bottle) {
        super(0);
        this.bottle = bottle;
    }

    shouldTrigger(character) {
        return character.isColliding(this.bottle);
    }

    activate(world) {
        let hole = new Hole(this.bottle.x - 150, 160, 160);
        world.level.holes.push(hole);
    }
}