let isMuted = false;

let sounds = {
    throw: createSound('assets/audio/throw.mp3', 0.6),
    bottleSmash: createSound('assets/audio/bottle-smash.mp3', 0.4)
};


function createSound(path, volume) {
    let sound = new Audio(path);
    sound.volume = volume;
    return sound;
}


function playSound(sound) {
    if (isMuted) {
        return;
    }
    sound.currentTime = 0;
    sound.play();
}