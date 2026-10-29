class Trap {
    triggerX;
    isTriggered = false;

    constructor(triggerX) {
        this.triggerX = triggerX;
    }

    check(world) {
        if (!this.isTriggered && this.shouldTrigger(world.character)) {
            this.isTriggered = true;
            this.activate(world);
        }
    }

    shouldTrigger(character) {
        return character.x > this.triggerX;
    }

    activate(world) {
    }
}