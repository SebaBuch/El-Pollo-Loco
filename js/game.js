let canvas;
let world;
let keyboard = new Keyboard();
let intervalIds = [];
let difficulty = 'easy';
let isTouchMode = false;
let isPaused = false;
let isGameRunning = false;
let lives = 1;

function init() {
    canvas = document.getElementById('canvas');
    SoundManager.init();
    loadControlMode();
    if (!document.fullscreenEnabled) {
        document.getElementById('fullscreenButton').classList.add('d-none');
    }
}

function enterMenu() {
    document.getElementById('introScreen').classList.add('d-none');
    SoundManager.playMenuMusic();
}

function startGame() {
    document.activeElement.blur();
    document.getElementById('startScreen').classList.add('d-none');
    lives = difficulty == 'impossible' ? 3 : 1;
    startLevel();
}

function startLevel() {
    keyboard = new Keyboard();
    initLevel();
    world = new World(canvas, keyboard);
    SoundManager.stopAllSounds();
    SoundManager.playMusic(SoundManager.sounds.background);
    isGameRunning = true;
    document.getElementById('pauseButton').classList.remove('d-none');
}

function startInterval(callback, time) {
    let id = setInterval(() => {
        if (!isPaused) {
            callback();
        }
    }, time);
    intervalIds.push(id);
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
    if (e.code == 'KeyF' && !e.repeat && document.fullscreenEnabled) {
        toggleFullscreen();
    }
    if (e.code == 'KeyP' && !e.repeat) {
        togglePause();
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
}

function setActionKeys(code, isPressed) {
    if (code == 'Space') {
        keyboard.SPACE = isPressed;
    }
    if (code == 'KeyD') {
        keyboard.D = isPressed;
    }
    if (code == 'KeyB') {
        keyboard.B = isPressed;
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
    isGameRunning = false;
    document.getElementById('pauseButton').classList.add('d-none');
}

function togglePause() {
    document.activeElement.blur();
    if (!isGameRunning || world.isGameOver) {
        return;
    }
    if (isPaused) {
        resumeGame();
    } else {
        pauseGame();
    }
}

function pauseGame() {
    isPaused = true;
    document.getElementById('pauseScreen').classList.remove('d-none');
    SoundManager.pauseGameSounds();
}

function resumeGame() {
    isPaused = false;
    document.getElementById('pauseScreen').classList.add('d-none');
    world.character.lastMove = new Date().getTime();
    SoundManager.playLoop(SoundManager.sounds.background);
}

function handleGameEnd(isWon) {
    if (!isWon && lives > 1) {
        lives--;
        stopGame();
        startLevel();
    } else {
        showEndScreen(isWon);
    }
}

function showEndScreen(isWon) {
    stopGame();
    let image = document.getElementById('endScreenImage');
    if (isWon) {
        image.src = 'assets/img/end_screens/you_won_a.png';
    } else {
        image.src = 'assets/img/end_screens/game_over.png';
    }
    SoundManager.playEndSound(isWon);
    showStats();
    document.getElementById('endScreen').classList.remove('d-none');
}

function showStats() {
    let stats = world.stats;
    let seconds = Math.floor(stats.frames / 60);
    let text = 'Coins: ' + stats.coins + ' | Chickens: ' + stats.chickens + ' | Time: ' + seconds + 's';
    document.getElementById('endStats').innerHTML = text;
}

function restartGame() {
    document.getElementById('endScreen').classList.add('d-none');
    startGame();
}

function backToMenu() {
    if (isGameRunning) {
        stopGame();
    }
    isPaused = false;
    document.getElementById('pauseScreen').classList.add('d-none');
    document.getElementById('endScreen').classList.add('d-none');
    document.getElementById('startScreen').classList.remove('d-none');
    SoundManager.stopAllSounds();
    SoundManager.setMenuMusic('menu');
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

function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.getElementById('fullscreenWrapper').requestFullscreen();
    }
    document.getElementById('fullscreenButton').blur();
}