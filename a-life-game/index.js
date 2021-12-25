"use strict";

var debug = true;
var canvas;
var stage;
var stageWidth;
var stageHeight;
var scaleFactor = 0.5;
var framerate = 30;
var framesPerMillisecond = framerate / 1000;
var millisecondsPerFrame = 1000 / framerate;
var PIOneEighty = Math.PI / 180;
var oneEightyPI = 180 / Math.PI;
var maxAnglePerFrame = 360 / framerate;
var loader;
var gameSpriteSheet;
var assetManifest = [
    { src: "game-spritesheet.png", id: "game-sprites" },
    { src: "game-spritesheet.json", id: "game-spriteframes" },
    { src: "game-background.png", id: "background" }
];

// Define all game configuration parameters
var configuration = {
};
// Define all active game state variables
var gameData = {
}

function debugLog(message) {
    if (debug) {
        console.log(message);
    }
}

function loadConfiguration() {
};

/**
 * Initialize the game and start loading assets based on the available resolution.
 */
function init() {
    canvas = document.getElementById("myCanvas");

    // check to see if we are running in a browser with touch support
    stage = new createjs.Stage(canvas);
    stage.autoClear = true;
    stage.enableDOMEvents(true);
    stageWidth = stage.canvas.width;
    stageHeight = stage.canvas.height;

    loadConfiguration();

    createjs.Touch.enable(stage);
    createjs.Ticker.framerate = framerate;

    loadAssets();
}

/**
 * Start loading assets based on the available resolution. When everything is loaded,
 * `handleLoadComplete` is called.
 */
 function loadAssets() {
    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", handleLoadComplete);
    loader.loadManifest(assetManifest, true, "./");
}

function showGUI() {
    var newCell = new Cell(21);
    console.log("New cell " + newCell.id);
}

function createSprites() {
    var spriteFrames = loader.getResult("game-spriteframes");
    spriteFrames.images = [loader.getResult("game-sprites")];
    spriteFrames.framerate = framerate;
    gameSpriteSheet = new createjs.SpriteSheet(spriteFrames);
}

function createBackground() {
    var background = stage.getChildByName("background");
    if (background == null) {
        background = new createjs.Shape();
        background.name = "background";
        var backgroundImage = loader.getResult("background");
        var imageWidth = backgroundImage.width;
        var imageHeight = backgroundImage.height;
        var scaleWidth = stageWidth / imageWidth;
        var scaleHeight = stageHeight / imageHeight;
        var scale;
        if (scaleWidth > scaleHeight) {
            scale = scaleWidth;
        } else {
            scale = scaleHeight;
        }
        background.graphics.beginBitmapFill(backgroundImage).drawRect(0, 0, imageWidth, imageHeight);
        background.scaleX = scale;
        background.scaleY = scale;
        background.cache(0, 0, stageWidth, stageHeight);
        stage.addChild(background);
    }
}

/**
 * After all game assets are loaded control comes here to initialize the game.
 */
function handleLoadComplete() {
    createSprites();
    createBackground();
    showGUI();
    createjs.Ticker.addEventListener("tick", onEnterFrame);
    stage.update();
}

function onEnterFrame(tickEvent) {
    var deltaTime = tickEvent.delta / 1000;
    stage.update(tickEvent);
}
