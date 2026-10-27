let canvas;
let world;
let keyboard = new Keyboard();
let intervalIds = [];
let isGameRunning = false;


function init() {
    canvas = document.getElementById('canvas');
}

function startGame() {
    document.getElementById('startScreen').classList.add('d-none');
    keyboard = new Keyboard();
    initLevel();
    world = new World(canvas, keyboard);
    isGameRunning = true;
    stopAllSounds();
    playLoop(sounds.background);
}

window.addEventListener('keydown', (e) => {
    setKey(e.code, true);
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

function openDialog() {
    document.getElementById('howToPlayDialog').showModal();
}

function closeDialog() {
    document.getElementById('howToPlayDialog').close();
}

function closeDialogOnBackdrop(event) {
    if (event.target.id == 'howToPlayDialog') {
        closeDialog();
    }
}

function stopGame() {
    for (let i = 0; i < intervalIds.length; i++) {
        clearInterval(intervalIds[i]);
    }
    intervalIds = [];
    cancelAnimationFrame(world.animationFrameId);
    isGameRunning = false;
    stopLoopSounds();
}

function showEndScreen(isWon) {
    stopGame();
    let image = document.getElementById('endScreenImage');
    if (isWon) {
        image.src = 'assets/img/You won, you lost/You won A.png';
    } else {
        image.src = 'assets/img/You won, you lost/Game Over.png';
    }
    playSound(isWon ? sounds.winScreen : sounds.lost);
    document.getElementById('endScreen').classList.remove('d-none');
}

function restartGame() {
    document.getElementById('endScreen').classList.add('d-none');
    startGame();
}