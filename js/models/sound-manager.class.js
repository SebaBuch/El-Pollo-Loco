class SoundManager {
    static isMuted = false;
    static currentMusic = null;
    static menuMusic = null;

    static sounds = {
        background: SoundManager.createLoopSound('assets/audio/background.mp3', 0.1),
        menu: SoundManager.createLoopSound('assets/audio/menu.mp3', 0.1),
        characterWalking: SoundManager.createLoopSound('assets/audio/character-walking.mp3', 0.4),
        snoring: SoundManager.createLoopSound('assets/audio/snoring.mp3', 0.1),
        jumping: SoundManager.createSound('assets/audio/jumping.mp3', 0.3),
        landing: SoundManager.createSound('assets/audio/landing.mp3', 0.3),
        endbossWalks: SoundManager.createLoopSound('assets/audio/endboss-walks.mp3', 0.5),
        endbossHurt: SoundManager.createSound('assets/audio/endboss-hurt.mp3', 0.5),
        throw: SoundManager.createSound('assets/audio/throw.mp3', 0.6),
        bottleSmash: SoundManager.createSound('assets/audio/bottle-smash.mp3', 0.4),
        coin: SoundManager.createSound('assets/audio/coin.mp3', 0.3),
        bottleCollect: SoundManager.createSound('assets/audio/bottle-open.mp3', 0.4),
        characterHit: SoundManager.createSound('assets/audio/character-hit.mp3', 0.4),
        bigChicken: SoundManager.createSound('assets/audio/big-chicken.mp3', 0.4),
        smallChicken: SoundManager.createSound('assets/audio/small-chicken.mp3', 0.3),
        endbossFirstContact: SoundManager.createSound('assets/audio/endboss-hadfirstcontact.mp3', 0.3),
        characterDies: SoundManager.createSound('assets/audio/character-dies.mp3', 0.5),
        winScreen: SoundManager.createSound('assets/audio/win-screen.mp3', 0.4),
        lost: SoundManager.createSound('assets/audio/lost.mp3', 0.5),
        lostOutro: SoundManager.createLoopSound('assets/audio/lost-outro.mp3', 0.3),
        intro1: SoundManager.createLoopSound('assets/audio/intro1.mp3', 0.15),
        intro2: SoundManager.createLoopSound('assets/audio/intro2.mp3', 0.15),
        intro3: SoundManager.createLoopSound('assets/audio/intro3.mp3', 0.15),
        intro4: SoundManager.createLoopSound('assets/audio/intro4.mp3', 0.15)
    };

    static init() {
        this.sounds.lost.onended = () => this.playLoop(this.sounds.lostOutro);
        this.menuMusic = this.sounds.menu;
        this.currentMusic = this.menuMusic;
        this.loadMuteState();
    }

    static createSound(path, volume) {
        let sound = new Audio(path);
        sound.volume = volume;
        return sound;
    }

    static createLoopSound(path, volume) {
        let sound = this.createSound(path, volume);
        sound.loop = true;
        sound.oncanplaythrough = () => {
            if (sound == this.currentMusic) {
                this.playLoop(sound);
            }
        };
        return sound;
    }

    static isReady(sound) {
        return sound.readyState == 4;
    }

    static playSound(sound) {
        if (this.isMuted || !this.isReady(sound)) {
            return;
        }
        sound.currentTime = 0;
        sound.play();
    }

    static playLoop(sound) {
        if (!this.isMuted && sound.paused && this.isReady(sound)) {
            sound.play();
        }
    }

    static playMusic(music) {
        this.currentMusic = music;
        this.playLoop(music);
    }

    static playEndSound(isWon) {
        if (isWon) {
            this.playSound(this.sounds.winScreen);
        } else {
            this.currentMusic = this.sounds.lostOutro;
            this.playSound(this.sounds.lost);
        }
    }

    static stopSound(sound) {
        sound.pause();
        sound.currentTime = 0;
    }

    static stopLoopSounds() {
        this.stopSound(this.sounds.background);
        this.stopSound(this.sounds.characterWalking);
        this.stopSound(this.sounds.snoring);
        this.stopSound(this.sounds.endbossWalks);
        this.currentMusic = null;
    }

    static stopAllSounds() {
        for (let key in this.sounds) {
            this.stopSound(this.sounds[key]);
        }
    }

    static playMenuMusic() {
        if (this.currentMusic == this.menuMusic) {
            this.playLoop(this.menuMusic);
        }
    }

    static setMenuMusic(name) {
        this.stopSound(this.menuMusic);
        this.menuMusic = this.sounds[name];
        this.currentMusic = this.menuMusic;
        this.playLoop(this.menuMusic);
    }

    static toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('isMuted', this.isMuted);
        this.updateMusic();
        this.updateMuteButton();
    }

    static updateMusic() {
        if (this.isMuted) {
            this.stopAllSounds();
        } else if (this.currentMusic) {
            this.playLoop(this.currentMusic);
        }
    }

    static updateMuteButton() {
        let icon = document.getElementById('muteIcon');
        icon.src = this.isMuted ? 'assets/icons/sound-off.svg' : 'assets/icons/sound-on.svg';
        document.getElementById('muteButton').blur();
    }

    static loadMuteState() {
        this.isMuted = localStorage.getItem('isMuted') == 'true';
        this.updateMuteButton();
    }
}