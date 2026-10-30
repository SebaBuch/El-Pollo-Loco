/**
 * Loads, plays and mutes all sounds of the game.
 */
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
        buyError: SoundManager.createSound('assets/audio/buy-error.mp3', 0.3),
        characterHit: SoundManager.createSound('assets/audio/character-hit.mp3', 0.4),
        laughing: SoundManager.createSound('assets/audio/laughing.mp3', 0.5),
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

    /**
     * Prepares the menu music, the lost outro and the saved mute state.
     */
    static init() {
        this.sounds.lost.onended = () => this.playLoop(this.sounds.lostOutro);
        this.menuMusic = this.sounds.menu;
        this.currentMusic = this.menuMusic;
        this.loadMuteState();
    }

    /**
     * Creates a sound.
     * @param {string} path - Path of the audio file
     * @param {number} volume - Volume between 0 and 1
     * @returns {HTMLAudioElement} The sound
     */
    static createSound(path, volume) {
        let sound = new Audio(path);
        sound.volume = volume;
        return sound;
    }

    /**
     * Creates a looping sound that starts as soon as it is loaded, if it is the current music.
     * @param {string} path - Path of the audio file
     * @param {number} volume - Volume between 0 and 1
     * @returns {HTMLAudioElement} The sound
     */
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

    /**
     * Checks if a sound is fully loaded.
     * @param {HTMLAudioElement} sound - The sound
     * @returns {boolean} True if the sound can be played
     */
    static isReady(sound) {
        return sound.readyState == 4;
    }

    /**
     * Plays a sound from the beginning.
     * @param {HTMLAudioElement} sound - The sound
     */
    static playSound(sound) {
        if (!this.isReady(sound)) {
            return;
        }
        sound.currentTime = 0;
        sound.play();
    }

    /**
     * Plays a looping sound if it is not already playing.
     * @param {HTMLAudioElement} sound - The sound
     */
    static playLoop(sound) {
        if (sound.paused && this.isReady(sound)) {
            sound.play();
        }
    }

    /**
     * Sets and plays the current music.
     * @param {HTMLAudioElement} music - The music
     */
    static playMusic(music) {
        this.currentMusic = music;
        this.playLoop(music);
    }

    /**
     * Plays the win sound or the lost sound.
     * @param {boolean} isWon - True if the game was won
     */
    static playEndSound(isWon) {
        if (isWon) {
            this.playSound(this.sounds.winScreen);
        } else {
            this.currentMusic = this.sounds.lostOutro;
            this.playSound(this.sounds.lost);
        }
    }

    /**
     * Stops a sound and rewinds it.
     * @param {HTMLAudioElement} sound - The sound
     */
    static stopSound(sound) {
        sound.pause();
        sound.currentTime = 0;
    }

    /**
     * Stops all looping game sounds.
     */
    static stopLoopSounds() {
        this.stopSound(this.sounds.background);
        this.stopSound(this.sounds.characterWalking);
        this.stopSound(this.sounds.snoring);
        this.stopSound(this.sounds.endbossWalks);
        this.currentMusic = null;
    }

    /**
     * Stops every sound.
     */
    static stopAllSounds() {
        for (let key in this.sounds) {
            this.stopSound(this.sounds[key]);
        }
    }

    /**
     * Pauses the game sounds without rewinding them.
     */
    static pauseGameSounds() {
        this.sounds.background.pause();
        this.sounds.characterWalking.pause();
        this.sounds.snoring.pause();
        this.sounds.endbossWalks.pause();
    }

    /**
     * Plays the menu music if it is the current music.
     */
    static playMenuMusic() {
        if (this.currentMusic == this.menuMusic) {
            this.playLoop(this.menuMusic);
        }
    }

    /**
     * Switches to another menu music.
     * @param {string} name - Key of the music in the sounds object
     */
    static setMenuMusic(name) {
        this.stopSound(this.menuMusic);
        this.menuMusic = this.sounds[name];
        this.currentMusic = this.menuMusic;
        this.playLoop(this.menuMusic);
    }

    /**
     * Mutes or unmutes all sounds and saves the choice.
     */
    static toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('isMuted', this.isMuted);
        this.applyMute();
        this.updateMuteButton();
    }

    /**
     * Applies the mute state to every sound.
     */
    static applyMute() {
        for (let key in this.sounds) {
            this.sounds[key].muted = this.isMuted;
        }
    }

    /**
     * Shows the matching icon on the mute button.
     */
    static updateMuteButton() {
        let icon = document.getElementById('muteIcon');
        icon.src = this.isMuted ? 'assets/icons/sound-off.svg' : 'assets/icons/sound-on.svg';
        document.getElementById('muteButton').blur();
    }

    /**
     * Loads the saved mute state from the local storage.
     */
    static loadMuteState() {
        this.isMuted = localStorage.getItem('isMuted') == 'true';
        this.applyMute();
        this.updateMuteButton();
    }
}