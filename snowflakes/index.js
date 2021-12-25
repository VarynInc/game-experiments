/**
 * Snowflake animation demo
 */
"use strict";
let canvas;
let stage;
let stageWidth;
let stageHeight;
const framerate = 30;
let loader;
let snowflakeSpriteSheet;
let numberOfSpriteFrames;
let backgroundShape = null;
let nextSnowflake = 0;

/**
 * Initialize the game and start loading assets based on the available resolution.
 */
function init() {
    canvas = document.getElementById("gameView");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    stage = new createjs.StageGL(canvas);
    stage.autoClear = true;
    stage.enableDOMEvents(true);
    stageWidth = stage.canvas.width;
    stageHeight = stage.canvas.height;
    createjs.Touch.enable(stage);
    createjs.Ticker.framerate = framerate;

    loadAssets();

    window.addEventListener("resize", resizeStage);
    resizeStage();
}

function resizeStage() {
    stageWidth = window.innerWidth
    stageHeight = window.innerHeight;

    canvas.width = stageWidth;
    canvas.height = stageHeight;
    if (backgroundShape != null) {
        createBackground();
    }

    stage.updateViewport(stageWidth, stageHeight);
    stage.update();
}

/**
 * Start loading assets based on the available resolution. When everything is loaded,
 * `handleLoadComplete` is called.
 */
function loadAssets() {
    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", handleLoadComplete);
    loader.loadManifest([
        { src: "snowflake-sprites.png", id: "game-sprites" },
        { src: "snowflake-sprites.json", id: "game-spriteframes" }
    ],
    true, "./");
}

function createSprites() {
    const spriteFrames = loader.getResult("game-spriteframes");
    numberOfSpriteFrames = 4;
    spriteFrames.images = [loader.getResult("game-sprites")];
    spriteFrames.framerate = framerate;
    snowflakeSpriteSheet = new createjs.SpriteSheet(spriteFrames);

    const numberOfSnowflakes = Math.floor(Math.random() * stageWidth * 0.25) + 200;
    for (let i = 0; i < numberOfSnowflakes; i += 1) {
        createSnowflake(numberOfSpriteFrames);
    }
}

function createSnowflake(numberOfSpriteFrames) {
    const spriteFrame = Math.floor(Math.random() * numberOfSpriteFrames);
    const sprite = new createjs.Sprite(snowflakeSpriteSheet, spriteFrame);
    const spriteSize = sprite.getBounds();
    const spriteScale = 0.1 + (Math.random() * 0.35);
    sprite.gotoAndStop(spriteFrame);
    stage.addChild(sprite);
    if (sprite) {
        sprite.setTransform(
            Math.floor(Math.random() * stageWidth),
            0 - ((spriteSize.height * 0.5) + Math.floor(Math.random() * spriteSize.height * 2)),
            spriteScale,
            spriteScale,
            0, 0, 0,
            spriteSize.width * 0.5,
            spriteSize.height * 0.5
        )
        const finalY = stageHeight + (spriteSize.height + Math.floor(Math.random() * 100));
        const finalX = sprite.x + (Math.floor(Math.random() * 40) - 20)
        const rotation = (Math.random() * 360) - 180;
        const lifeTime = 15000 + (Math.floor(Math.random() * 5000));
        createjs.Tween.get(sprite, { loop: -1 })
            .wait(Math.floor(Math.random() * 1500))
            .to({ y: finalY }, lifeTime)
            .call(function(tween) {
                stage.removeChild(tween.target);
            });
        createjs.Tween.get(sprite, { loop: 4, bounce: true })
            .to({ x: finalX }, Math.floor(lifeTime / 4));
        createjs.Tween.get(sprite, { loop: 10, bounce: true })
            .to({ rotation: rotation }, Math.floor(lifeTime / 10), createjs.Ease.getElasticInOut(1, 5));
    }
}

function createBackground() {
    if (backgroundShape != null) {
        stage.removeChild(backgroundShape);
    }
    const graphics = new createjs.Graphics()
        .beginLinearGradientFill(["#000044", "#0000ff"], [0, 1], 0, 0, 0, stageHeight)
        .drawRect(0, 0, stageWidth, stageHeight);
    backgroundShape = new createjs.Shape(graphics);
    backgroundShape.cache(0, 0, stageWidth, stageHeight);
    stage.addChildAt(backgroundShape, 0);
}

/**
 * After all game assets are loaded control comes here to initialize the game.
 */
function handleLoadComplete() {
    createBackground();
    createSprites();
    createjs.Ticker.addEventListener("tick", onEnterFrame);
    stage.update();
}

function onEnterFrame(tickEvent) {
    var deltaTime = tickEvent.delta / 1000;

    // seed more snowflakes
    nextSnowflake -= tickEvent.delta;
    if (nextSnowflake <= 0) {
        createSnowflake(numberOfSpriteFrames);
        nextSnowflake = Math.floor(Math.random() * 100);
    }

    stage.update(tickEvent);
}
