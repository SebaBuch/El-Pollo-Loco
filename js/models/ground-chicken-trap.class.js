class GroundChickenTrap extends AirChickenTrap {

    shouldTrigger(character) {
        let characterLeft = character.x + character.offset.left;
        let characterRight = character.x + character.width - character.offset.right;
        let coinLeft = this.coin.x + this.coin.offset.left;
        let coinRight = this.coin.x + this.coin.width - this.coin.offset.right;
        let isUnderCoin = characterRight > coinLeft - 5 && characterLeft < coinRight;
        return isUnderCoin && character.isOnGround();
    }

    activate(world) {
        let chicken = new TrapChicken(world.character.x + 580, 360, 40, false);
        world.level.enemies.push(chicken);
    }
}