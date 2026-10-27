let isMuted = false;
let currentMusic = null;

let sounds = {
    background: createLoopSound('assets/audio/background.mp3', 0.1),
    characterWalking: createLoopSound('assets/audio/character-walking.mp3', 0.4),
    endbossWalks: createLoopSound('assets/audio/endboss-walks.mp3', 0.5),
    throw: createSound('assets/audio/throw.mp3', 0.6),
    bottleSmash: createSound('assets/audio/bottle-smash.mp3', 0.4),
    characterHit: createSound('assets/audio/character-hit.mp3', 0.4),
    bigChicken: createSound('assets/audio/big-chicken.mp3', 0.4),
    smallChicken: createSound('assets/audio/small-chicken.mp3', 0.3),
    endbossFirstContact: createSound('assets/audio/endboss-hadfirstcontact.mp3', 0.3),
    characterDies: createSound('assets/audio/character-dies.mp3', 0.5),
    endbossDies: createSound('assets/audio/endboss-dies.mp3', 0.5),
    winScreen: createSound('assets/audio/win-screen.mp3', 0.4),
    lost: createSound('assets/audio/lost.mp3', 0.5),
    lostOutro: createLoopSound('assets/audio/lost-outro.mp3', 0.3)
};

sounds.lost.onended = () => playLoop(sounds.lostOutro);

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

function playMusic(music) {
    currentMusic = music;
    playLoop(music);
}

function stopSound(sound) {
    sound.pause();
    sound.currentTime = 0;
}

function stopLoopSounds() {
    stopSound(sounds.background);
    stopSound(sounds.characterWalking);
    stopSound(sounds.endbossWalks);
    currentMusic = null;
}

function stopAllSounds() {
    for (let key in sounds) {
        stopSound(sounds[key]);
    }
}

function toggleMute() {
    isMuted = !isMuted;
    updateMusic();
    updateMuteButton();
}

function updateMusic() {
    if (isMuted) {
        stopAllSounds();
    } else if (currentMusic) {
        playLoop(currentMusic);
    }
}

function updateMuteButton() {
    let button = document.getElementById('muteButton');
    button.innerHTML = isMuted ? 'Unmute' : 'Mute';
    button.blur();
}