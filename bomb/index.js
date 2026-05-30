/**
 * Simulate a bomb explosion animation.
 */
let canvas = null;
let stage = null;
let container = null;
let loadQueue = null;
let spriteSheet = null;
let bombSprite = null;

function resizeCanvas() {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (container) {
            container.width = canvas.width;
            container.height = canvas.height;
        }
    }
}

const bombAnimations = [
    "bomb",
    "bomb-fuse",
    "bomb-fuse-burn",
    "bomb-ex"
];
const assetFolder = "./assets/";
const gameAssetsManifest = [
    { id: "bomb-sprites", src: assetFolder + "bomb-sprites-100.png" },
    { id: "bomb-sprites-frames", src: assetFolder + "bomb-sprites-100.json" }
];
const gameSounds = [
    { id: "explode", src: assetFolder + "explode.mp3" },
    { id: "fuse", src: assetFolder + "fuse.mp3" },
];

function onEnterFrame(event) {
    if (bombSprite && bombSprite.startTime > 0) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - bombSprite.startTime;
        if (bombSprite.animation == bombAnimations[1] && elapsedTime > 2000) {
            bombSprite.animation = bombAnimations[2];
            bombSprite.gotoAndPlay(bombSprite.animation);
        } else if (bombSprite.animation == bombAnimations[2] && elapsedTime > 5000) {
            bombSprite.animation = bombAnimations[3];
            bombSprite.gotoAndPlay(bombSprite.animation);
        }
    }
    stage.update(event);
}

function createBomb() {
    if (bombSprite !== null) {
        return;
    }
    const startFrame = bombAnimations[0];
    const shape = new createjs.Shape();
    const graphics = shape.graphics;
    shape.x = 0;
    shape.y = 0;
    graphics.beginFill("#11473f");
    graphics.beginStroke("#0f0f0f");
    graphics.setStrokeStyle(2);
    graphics.drawRect(0, 0, container.width, container.height);
    container.addChild(shape);

    bombSprite = new createjs.Sprite(spriteSheet.spriteData, startFrame);
    bombSprite.framerate = 30;
    bombSprite.name = startFrame;
    bombSprite.visible = true;
    bombSprite.startTime = 0;
    bombSprite.animation = startFrame;
    bombSprite.loopCounter = 0;
    bombSprite.bombSound = null;

    bombSprite.setTransform((container.width * 0.5) - 50, (container.height * 0.5) - 50, 2, 2, 0, 0, 0, 0, 0);
    container.addChild(bombSprite);
    bombSprite.addEventListener("click", function() {
        if (bombSprite.startTime == 0) {
            bombSprite.startTime = Date.now();
            bombSprite.animation = "bomb-fuse";
            bombSprite.loopCounter = 0;
            bombSprite.gotoAndPlay(bombSprite.animation);
            bombSprite.bombSound = createjs.Sound.play("fuse", {volume: 100});
        }
    });
    bombSprite.addEventListener("animationend", function(event) {
        if (event.name === bombAnimations[1]) {
            if (bombSprite.loopCounter < 3) {
                bombSprite.loopCounter += 1;
                if (bombSprite.loopCounter >= 3) {
                    bombSprite.stop();
                    bombSprite.animation = bombAnimations[2];
                    bombSprite.gotoAndPlay(bombSprite.animation);
                }
            }
        } else if (event.name == bombAnimations[2]) {
            bombSprite.stop();
            bombSprite.animation = bombAnimations[3];
            bombSprite.gotoAndPlay(bombSprite.animation);
            bombSprite.bombSound.stop();
            bombSprite.bombSound = createjs.Sound.play("explode", {volume: 100});
        } else if (event.name == bombAnimations[3]) {
            bombSprite.stop();
            bombSprite.startTime = 0;
            bombSprite.animation = bombAnimations[0];
            bombSprite.gotoAndStop(bombSprite.animation);
            bombSprite.bombSound = null;
        }
    });
}

function triggerBomb() {
    const soundAssetId = gameSounds[0].id;
    const result = createjs.Sound.play(soundAssetId, {volume: 100});
    if (result.playState == "playFailed") {
        console.error("triggerSoundFx " + result.playState + " for " + soundAssetId);
    }
}

function handleLoadComplete() {
    const spriteSheetName = gameAssetsManifest[1].id;
    const spriteSheetFrames = loadQueue.getResult(spriteSheetName);
    if (spriteSheetFrames != null) {
        spriteSheet = spriteSheetFrames;
        spriteSheet.images = [loadQueue.getResult(gameAssetsManifest[0].id)];
        spriteSheet.spriteData = new createjs.SpriteSheet(spriteSheetFrames);
    } else {
        console.error("Error: sprite sheet " + spriteSheetName + " was not loaded.");
    }
    container = new createjs.Container();
    stage.addChild(container);
    resizeCanvas();
    createBomb();
}

function loadAssets() {
    const assetManifest = [];
    loadQueue = new createjs.LoadQueue(true, "", "anonymous");
    loadQueue.installPlugin(createjs.Sound);
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

function init() {
    canvas = document.getElementById("gameView");
    stage = new createjs.Stage("gameView");

    resizeCanvas();

    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", onEnterFrame);
    window.addEventListener("resize", resizeCanvas);
    loadAssets();
}
