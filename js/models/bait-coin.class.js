class BaitCoin extends Coin {
    isFakeAfterFling = true;

    isFake(character) {
        return this.isFakeAfterFling || !character.wasFlung;
    }
}