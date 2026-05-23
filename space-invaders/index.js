/**
 * Space invaders
 */

/**
 * Define all possible game states.
 */
const GAME_STATES = {
    LOAD: "load",
    MENU: "menu",
    PLAY: "play",
    LEVEL_UP: "levelup",
    GAME_OVER: "gameover",
};

/**
 * Define the game state object that will hold all relevant information about the current state of the game.
 */
const gameState = {
    canvas: document.getElementById("gameView"),
    stage: null,
    container: null,
    currentState: GAME_STATES.LOAD,
    nextState: GAME_STATES.MENU,
    runState: null,
    level: 0,
    score: 0,
    startTime: null,
    endTime: null,
};

function newGame() {
    gameState.score = 0;
    gameState.level = 1;
    gameState.startTime = Date.now();
    gameState.endTime = null;
}

/**
 * Show splash screen and load all necessary assets for the game, such as images, sounds, etc. Once loading is
 * complete, transition to the next game state (e.g., menu).
 */
function gameStateLoad() {

}

/**
 * Display the main menu of the game, allowing the player to start a new game, view high scores, adjust settings, etc.
 */
function gameStateMenu() {

}

/**
 * Handle the main gameplay loop, including player input, enemy behavior, collision detection, scoring, and other core mechanics of the game.
 */
function gameStatePlay() {

}

/**
 * After completing a level, show a level-up screen and wait for the player to proceed to the next level or return to the main menu.
 */
function gameStateLevelUp() {

}

/**
 * When the player meets the game-over conditions, display a game-over screen with options to restart or return to the main menu.
 */
function gameStateGameOver() {

}

/**
 * Resize the canvas to fit the window size and update the container dimensions accordingly.
 */
function resizeCanvas() {
    const canvas = gameState.canvas;
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const container = gameState.container;
        if (container) {
            container.width = canvas.width;
            container.height = canvas.height;
        }
    }
}

/**
 * Handle the enter frame event for the game loop.
 * @param {Event} tickerEvent CreateJS ticker event.
 */
function onEnterFrame(tickerEvent) {
    if ( ! tickerEvent.paused) {
        if (gameState.runState === null) {
            return;
        }
        gameState.runState();
        gameState.stage.update();
    }
}

/**
 * One-time initialize the game on load, setting up the game state machine.
 */
function init() {
    gameState.stage = new createjs.Stage("gameView");
    gameState.container = new createjs.Container();
    gameState.stage.addChild(gameState.container);
    gameState.runState = gameStateLoad;

    resizeCanvas();

    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", onEnterFrame);
    window.addEventListener("resize", resizeCanvas);
}
