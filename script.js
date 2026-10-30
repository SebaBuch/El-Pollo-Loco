let canvas;
let world;
let keyboard = new Keyboard();
let intervalIds = [];
let difficulty = 'easy';
let isTouchMode = false;
let isPaused = false;
let isGameRunning = false;
let lives = 1;

/**
 * Prepares canvas, sounds and controls when the page is loaded.
 */
function init() {
    canvas = document.getElementById('canvas');
    SoundManager.init();
    loadControlMode();
    if (!document.fullscreenEnabled) {
        document.getElementById('fullscreenButton').classList.add('d-none');
    }
}

/**
 * Hides the intro screen and starts the menu music.
 */
function enterMenu() {
    document.getElementById('introScreen').classList.add('d-none');
    SoundManager.playMenuMusic();
}

/**
 * Starts a new game with the lives of the chosen difficulty.
 */
function startGame() {
    document.activeElement.blur();
    document.getElementById('startScreen').classList.add('d-none');
    lives = difficulty == 'impossible' ? 3 : 1;
    SoundManager.stopAllSounds();
    startLevel();
}

/**
 * Creates the level and the world and starts the game music.
 */
function startLevel() {
    keyboard = new Keyboard();
    initLevel();
    world = new World(canvas, keyboard);
    SoundManager.playMusic(SoundManager.sounds.background);
    isGameRunning = true;
    document.getElementById('pauseButton').classList.remove('d-none');
}

/**
 * Starts an interval that pauses with the game and can be stopped later.
 * @param {Function} callback - Function that runs in every interval
 * @param {number} time - Time between two runs in milliseconds
 */
function startInterval(callback, time) {
    let id = setInterval(() => {
        if (!isPaused) {
            callback();
        }
    }, time);
    intervalIds.push(id);
}

/**
 * Saves the chosen difficulty and marks its button.
 * @param {string} level - 'easy' or 'impossible'
 */
function selectDifficulty(level) {
    difficulty = level;
    document.getElementById('easyButton').classList.remove('selected-difficulty');
    document.getElementById('impossibleButton').classList.remove('selected-difficulty');
    document.getElementById(level + 'Button').classList.add('selected-difficulty');
    updateTheme(level);
    closeDialog('difficultyDialog');
}

/**
 * Switches the page design to the chosen difficulty.
 * @param {string} level - 'easy' or 'impossible'
 */
function updateTheme(level) {
    if (level == 'impossible') {
        document.body.classList.add('impossible-mode');
    } else {
        document.body.classList.remove('impossible-mode');
    }
}

/**
 * Saves pressed keys and handles the shortcuts M, F and P.
 */
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

/**
 * Saves released keys.
 */
window.addEventListener('keyup', (e) => {
    setKey(e.code, false);
});

/**
 * Saves the state of a control key.
 * @param {string} code - Code of the key
 * @param {boolean} isPressed - True if the key is pressed
 */
function setKey(code, isPressed) {
    setArrowKeys(code, isPressed);
    setActionKeys(code, isPressed);
}

/**
 * Saves the state of the arrow keys.
 * @param {string} code - Code of the key
 * @param {boolean} isPressed - True if the key is pressed
 */
function setArrowKeys(code, isPressed) {
    if (code == 'ArrowRight') {
        keyboard.RIGHT = isPressed;
    }
    if (code == 'ArrowLeft') {
        keyboard.LEFT = isPressed;
    }
}

/**
 * Saves the state of space, D and B.
 * @param {string} code - Code of the key
 * @param {boolean} isPressed - True if the key is pressed
 */
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

/**
 * Opens a dialog and plays its music.
 * @param {string} id - Id of the dialog
 * @param {string} musicName - Key of the music in the sounds object
 */
function openDialog(id, musicName) {
    document.getElementById(id).showModal();
    SoundManager.setMenuMusic(musicName);
}

/**
 * Closes a dialog.
 * @param {string} id - Id of the dialog
 */
function closeDialog(id) {
    document.getElementById(id).close();
}

/**
 * Closes a dialog when the click is outside of its content.
 * @param {MouseEvent} event - The click event
 */
function closeDialogOnBackdrop(event) {
    if (event.target.tagName == 'DIALOG') {
        event.target.close();
    }
}

/**
 * Stops all intervals, the drawing and the game sounds.
 */
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

/**
 * Pauses or resumes the running game.
 */
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

/**
 * Pauses the game and shows the pause screen.
 */
function pauseGame() {
    isPaused = true;
    document.getElementById('pauseScreen').classList.remove('d-none');
    SoundManager.pauseGameSounds();
}

/**
 * Resumes the game and hides the pause screen.
 */
function resumeGame() {
    isPaused = false;
    document.getElementById('pauseScreen').classList.add('d-none');
    world.character.lastMove = new Date().getTime();
    SoundManager.playLoop(SoundManager.sounds.background);
}

/**
 * Restarts the level while lives are left or shows the end screen.
 * @param {boolean} isWon - True if the level was won
 */
function handleGameEnd(isWon) {
    if (!isWon && lives > 1) {
        lives--;
        stopGame();
        startLevel();
    } else {
        showEndScreen(isWon);
    }
}

/**
 * Shows the win or game over screen.
 * @param {boolean} isWon - True if the level was won
 */
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

/**
 * Shows coins, chickens and time on the end screen.
 */
function showStats() {
    let stats = world.stats;
    let seconds = Math.floor(stats.frames / 60);
    let text = 'Coins: ' + stats.coins + ' | Chickens: ' + stats.chickens + ' | Time: ' + seconds + 's';
    document.getElementById('endStats').innerHTML = text;
}

/**
 * Hides the end screen and starts a new game.
 */
function restartGame() {
    document.getElementById('endScreen').classList.add('d-none');
    startGame();
}

/**
 * Stops the game and shows the start screen.
 */
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

/**
 * Saves a pressed mobile button.
 * @param {PointerEvent} event - The pointer event
 * @param {string} key - Name of the key in the keyboard object
 */
function pressKey(event, key) {
    if (event.cancelable) {
        event.preventDefault();
    }
    keyboard[key] = true;
}

/**
 * Saves a released mobile button.
 * @param {PointerEvent} event - The pointer event
 * @param {string} key - Name of the key in the keyboard object
 */
function releaseKey(event, key) {
    if (event.cancelable) {
        event.preventDefault();
    }
    keyboard[key] = false;
}

/**
 * Loads the saved control mode or detects a touch device.
 */
function loadControlMode() {
    let savedMode = localStorage.getItem('isTouchMode');
    if (savedMode == null) {
        isTouchMode = window.matchMedia('(hover: none)').matches;
    } else {
        isTouchMode = savedMode == 'true';
    }
    updateControlMode();
}

/**
 * Switches between keyboard and touch controls and saves the choice.
 */
function toggleControlMode() {
    isTouchMode = !isTouchMode;
    localStorage.setItem('isTouchMode', isTouchMode);
    updateControlMode();
    document.getElementById('controlModeButton').blur();
}

/**
 * Shows or hides the mobile buttons and updates the button text.
 */
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

/**
 * Opens or closes the fullscreen mode.
 */
function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.getElementById('fullscreenWrapper').requestFullscreen();
    }
    document.getElementById('fullscreenButton').blur();
}