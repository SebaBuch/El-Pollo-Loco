let canvas;
let world;
let keyboard = new Keyboard();


function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
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