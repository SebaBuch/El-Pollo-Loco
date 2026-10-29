class Trap {
    triggerX;
    isTriggered = false;
    phase = 'always';

    constructor(triggerX) {
        this.triggerX = triggerX;
    }

    check(world) {
        let character = world.character;
        if (!this.isTriggered && this.isInPhase(character) && this.shouldTrigger(character)) {
            this.isTriggered = true;
            this.activate(world);
        }
    }

    isInPhase(character) {
        if (this.phase == 'beforeFling') {
            return !character.wasFlung;
        }
        if (this.phase == 'afterFling') {
            return character.wasFlung;
        }
        return true;
    }

    shouldTrigger(character) {
        return character.x > this.triggerX;
    }

    activate(world) {
    }
}