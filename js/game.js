let canvas;
let world;
let keyboard = new Keyboard();


function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

window.addEventListener('keydown', (e) => {
    setKey(e.keyCode, true);
});

window.addEventListener('keydown', (e) => {
    setKey(e.keyCode, true);
});

function setKey(keyCode, isPressed) {
    setArrowKeys(keyCode, isPressed);
    setActionKeys(keyCode, isPressed);
}

function setArrowKeys(keyCode, isPressed) {
    if (keyCode == 39) {
        keyboard.RIGHT = isPressed;
    }
    if (keyCode == 37) {
        keyboard.LEFT = isPressed;
    }
    if (keyCode == 38) {
        keyboard.UP = isPressed;
    }
    if (keyCode == 40) {
        keyboard.DOWN = isPressed;
    }
}

function setActionKeys(keyCode, isPressed) {
    if (keyCode == 32) {
        keyboard.SPACE = isPressed;
    }
    if (keyCode == 68) {
        keyboard.D = isPressed;
    }
}