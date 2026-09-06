/**
 * Space invaders
 */
const assetFolder = "./assets/";
const gameAssetsManifest = [
    { id: "invader-sprites", src: assetFolder + "invader-sprites.png" },
    { id: "invader-sprites-frames", src: assetFolder + "invader-sprites.json" }
];
const gameSounds = [
];

/**
 * Define all possible game states.
 */
const GAME_STATES = {
    INIT: "init",
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
    currentState: GAME_STATES.INIT,
    priorState: GAME_STATES.INIT,
    runState: null,
    level: 0,
    score: 0,
    startTime: null,
    endTime: null,
};
let stage;
let loadQueue;
let spriteSheet = null;

function newGame() {
    gameState.score = 0;
    gameState.level = 1;
    gameState.startTime = Date.now();
    gameState.endTime = null;
}

/**
 * Advance the game state to the indicated game state and update the
 * state machine to invoke the respective state function.
 * @param {string} nextState Next state to advance to.
 */
function gameStateNext(nextState) {
    gameState.priorState = gameState.currentState;
    gameState.currentState = nextState;
    switch (nextState) {
        case GAME_STATES.INIT:
            gameState.runState = init;
            break;
        case GAME_STATES.LOAD:
            gameState.runState = gameStateLoad;
            break;
        case GAME_STATES.MENU:
            gameState.runState = gameStateMenu;
            break;
        case GAME_STATES.PLAY:
            gameState.runState = gameStatePlay;
            break;
        case GAME_STATES.LEVEL_UP:
            gameState.runState = gameStateLevelUp;
            break;
        case GAME_STATES.GAME_OVER:
            gameState.runState = gameStateGameOver;
            break;
    }
}

/**
 * Show splash screen and load all necessary assets for the game, such as images, sounds, etc. Once loading is
 * complete, transition to the next game state (e.g., menu).
 */
function gameStateLoad() {
    // @todo: monitor loading progress, update load bar
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
    gameStateNext(GAME_STATES.LOAD);
    loadAssets();
}

/**
 * Start the game load procedures.
 */
function loadAssets() {
    const assetManifest = [];
    loadQueue = new createjs.LoadQueue(true, "", "anonymous");
    loadQueue.on("complete", handleLoadComplete, this);
    loadQueue.installPlugin(createjs.Sound);
    if ( ! createjs.Sound.initializeDefaultPlugins()) {
        console.error("CreateJS.Sound error cannot init initializeDefaultPlugins");
    }
    createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]);
    createjs.Sound.alternateExtensions = ["mp3"];
    gameSounds.forEach(function(soundConfig) {
        assetManifest.push({
            src: soundConfig.src,
            id: soundConfig.id
        });
    });
    gameAssetsManifest.forEach(function(asset) {
        assetManifest.push({
            src: asset.src,
            id: asset.id
        })
    });
    loadQueue.loadManifest(assetManifest);
    loadQueue.load();
}

/**
 * We come here when all assets are loaded.
 */
function handleLoadComplete() {
    const spriteSheetName = "invader-sprites-frames";
    const spriteSheetFrames = loadQueue.getResult(spriteSheetName);
    if (spriteSheetFrames != null) {
        spriteSheet = spriteSheetFrames;
        spriteSheet.images = [loadQueue.getResult("invader-sprites")];
        spriteSheet.spriteData = new createjs.SpriteSheet(spriteSheetFrames);
    } else {
        console.error("Error: sprite sheet " + spriteSheetName + " was not loaded.");
    }

    resizeCanvas();
    gameStateNext(GAME_STATES.MENU);
}
