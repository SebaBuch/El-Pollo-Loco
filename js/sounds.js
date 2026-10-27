let isMuted = false;

let sounds = {
    background: createLoopSound('assets/audio/background.mp3', 0.1),
    throw: createSound('assets/audio/throw.mp3', 0.6),
    bottleSmash: createSound('assets/audio/bottle-smash.mp3', 0.4)
};


function createSound(path, volume) {
    let sound = new Audio(path);
    sound.volume = volume;
    return sound;
}


function createLoopSound(path, volume) {
    let sound = createSound(path, volume);
    sound.loop = true;
    return sound;
}


function playSound(sound) {
    if (isMuted) {
        return;
    }
    sound.currentTime = 0;
    sound.play();
}


function playLoop(sound) {
    if (!isMuted && sound.paused) {
        sound.play();
    }
}


function stopSound(sound) {
    sound.pause();
    sound.currentTime = 0;
}


function stopLoopSounds() {
    stopSound(sounds.background);
}


function stopAllSounds() {
    for (let key in sounds) {
        stopSound(sounds[key]);
    }
}