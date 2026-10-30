# El Pollo Loco
 
A 2D jump-and-run game built with HTML5 Canvas and object-oriented JavaScript. Help Pepe cross the desert, collect coins and salsa bottles, and defeat the giant chicken. Or try the Impossible mode, where nothing is what it seems.
 
**Play it here:** [El Pollo Loco](sebastianbuchholz.developerakademie.net/El%20Pollo%20Loco)
 
## Game modes
 
### Easy
The classic game. Jump on chickens to defeat them, collect bottles and coins, and beat the endboss by throwing salsa bottles at him. Coins can be traded for extra bottles.
 
### Impossible
A troll level inspired by games like *Level Devil*:
- One hit kills, but you have three lives
- No enemies can be defeated
- Traps trigger when you least expect them: chickens fall from the sky, coins lure you into ambushes, holes grow while you jump over them, and bottles run away
- The goal flag does not want to be reached
## Controls
 
| Key | Action |
| --- | --- |
| Arrow left / right | Walk |
| Space | Jump |
| D | Throw bottle |
| B | Buy bottle (2 coins) |
| P | Pause |
| M | Mute / unmute |
| F | Fullscreen |
 
On touch devices, on-screen buttons are shown automatically. They can also be switched on in the start menu.
 
## Features
 
- Two difficulty modes with their own level design and color theme
- Endboss with alert, attack, counterattack and hurt states
- Coin shop to buy extra bottles
- Smooth camera that follows Pepe and looks ahead in the walking direction
- Sound effects and music for every menu and game situation, with a saved mute setting
- Pause menu, fullscreen mode and end screen with statistics
- Responsive layout with touch controls and a rotate hint for mobile devices
- Image cache so every image is only loaded once
## Technologies
 
- HTML5 Canvas
- CSS3 (Flexbox, media queries)
- JavaScript (ES6 classes, inheritance)
- JSDoc
## Project structure
 
```
├── index.html
├── style.css
├── script.js              # Game start, controls, menus
├── levels/
│   ├── level1.js          # Easy level
│   └── level2.js          # Impossible level
├── js/models/             # All classes
│   ├── world.class.js     # Game loop and drawing
│   ├── collision-manager.class.js
│   ├── bottle-manager.class.js
│   ├── character.class.js
│   ├── endboss.class.js
│   ├── trap.class.js      # Base class of all traps
│   └── ...
└── assets/                # Images, sounds, fonts, icons
```
 
## Run locally
 
1. Clone the repository
2. Open `index.html` in your browser, or use a local server like the *Live Server* extension in VS Code
## Credits
 
- Graphics: [Developer Akademie](https://developerakademie.com)
- Sounds and music: [Pixabay](https://pixabay.com)
- Intro image: generated with ChatGPT
## Author
 
Sebastian Buchholz