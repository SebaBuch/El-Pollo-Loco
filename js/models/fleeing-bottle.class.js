class FleeingBottle extends Bottle {
    fleeDistance = 0;
    maxFleeDistance;

    constructor(x, maxFleeDistance) {
        super(x);
        this.maxFleeDistance = maxFleeDistance;
    }

    flee(character) {
        let distance = this.x - character.x;
        let canFlee = this.fleeDistance < this.maxFleeDistance;
        if (distance > 0 && distance < 250 && canFlee) {
            this.x += 6;
            this.fleeDistance += 6;
        }
    }
}