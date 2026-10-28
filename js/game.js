let canvas;
let world;
let keyboard = new Keyboard();
let intervalIds = [];
let difficulty = 'easy';
let isTouchMode = false;

function init() {
    canvas = document.getElementById('canvas');
    SoundManager.init();
    loadControlMode();
}

function enterMenu() {
    document.getElementById('introScreen').classList.add('d-none');
    SoundManager.playMenuMusic();
}

function startGame() {
    document.getElementById('startScreen').classList.add('d-none');
    keyboard = new Keyboard();
    initLevel();
    world = new World(canvas, keyboard);
    SoundManager.stopAllSounds();
    SoundManager.playMusic(SoundManager.sounds.background);
}

function selectDifficulty(level) {
    difficulty = level;
    document.getElementById('easyButton').classList.remove('selected-difficulty');
    document.getElementById('impossibleButton').classList.remove('selected-difficulty');
    document.getElementById(level + 'Button').classList.add('selected-difficulty');
    closeDialog('difficultyDialog');
}

window.addEventListener('keydown', (e) => {
    setKey(e.code, true);
    if (e.code == 'KeyM' && !e.repeat) {
        SoundManager.toggleMute();
    }
});

window.addEventListener('keyup', (e) => {
    setKey(e.code, false);
});

function setKey(code, isPressed) {
    setArrowKeys(code, isPressed);
    setActionKeys(code, isPressed);
}

function setArrowKeys(code, isPressed) {
    if (code == 'ArrowRight') {
        keyboard.RIGHT = isPressed;
    }
    if (code == 'ArrowLeft') {
        keyboard.LEFT = isPressed;
    }
    if (code == 'ArrowUp') {
        keyboard.UP = isPressed;
    }
    if (code == 'ArrowDown') {
        keyboard.DOWN = isPressed;
    }
}

function setActionKeys(code, isPressed) {
    if (code == 'Space') {
        keyboard.SPACE = isPressed;
    }
    if (code == 'KeyD') {
        keyboard.D = isPressed;
    }
}

function openDialog(id, musicName) {
    document.getElementById(id).showModal();
    SoundManager.setMenuMusic(musicName);
}

function closeDialog(id) {
    document.getElementById(id).close();
}

function closeDialogOnBackdrop(event) {
    if (event.target.tagName == 'DIALOG') {
        event.target.close();
    }
}

function stopGame() {
    for (let i = 0; i < intervalIds.length; i++) {
        clearInterval(intervalIds[i]);
    }
    intervalIds = [];
    cancelAnimationFrame(world.animationFrameId);
    SoundManager.stopLoopSounds();
}

function showEndScreen(isWon) {
    stopGame();
    let image = document.getElementById('endScreenImage');
    if (isWon) {
        image.src = 'assets/img/You won, you lost/You won A.png';
    } else {
        image.src = 'assets/img/You won, you lost/Game Over.png';
    }
    SoundManager.playEndSound(isWon);
    document.getElementById('endScreen').classList.remove('d-none');
}

function restartGame() {
    document.getElementById('endScreen').classList.add('d-none');
    startGame();
}

function pressKey(event, key) {
    if (event.cancelable) {
        event.preventDefault();
    }
    keyboard[key] = true;
}

function releaseKey(event, key) {
    if (event.cancelable) {
        event.preventDefault();
    }
    keyboard[key] = false;
}

function loadControlMode() {
    let savedMode = localStorage.getItem('isTouchMode');
    if (savedMode == null) {
        isTouchMode = window.matchMedia('(hover: none)').matches;
    } else {
        isTouchMode = savedMode == 'true';
    }
    updateControlMode();
}

function toggleControlMode() {
    isTouchMode = !isTouchMode;
    localStorage.setItem('isTouchMode', isTouchMode);
    updateControlMode();
    document.getElementById('controlModeButton').blur();
}

function updateControlMode() {
    let container = document.getElementById('gameContainer');
    let button = document.getElementById('controlModeButton');
    if (isTouchMode) {
        container.classList.add('touch-mode');
    } else {
        container.classList.remove('touch-mode');
    }
    button.innerHTML = isTouchMode ? 'Controls: Touch' : 'Controls: Keyboard';
}