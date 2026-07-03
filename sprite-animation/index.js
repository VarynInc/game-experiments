/**
 * Various animation techniques.
 */
const assetFolder = "./assets/";
const gameAssetsManifest = [
    { id: "joker", src: assetFolder + "joker.png" },
    { id: "heart", src: assetFolder + "heart.png" },
    { id: "coin", src: assetFolder + "coin.png" },
    { id: "2x", src: assetFolder + "2x-hot.png" },
    { id: "cherries", src: assetFolder + "cherries.png" },
    { id: "bomb-sprites", src: assetFolder + "bomb-sprites-100.png" },
    { id: "bomb-sprites-frames", src: assetFolder + "bomb-sprites-100.json" }
];
const gameSounds = [
    { id: "explode", src: assetFolder + "explode.mp3" },
    { id: "fuse", src: assetFolder + "fuse.mp3" },
];
const bombAnimations = [
    "bomb",
    "bomb-fuse",
    "bomb-fuse-burn",
    "bomb-ex"
];
const margin = 12;
let stage;
let loadQueue;
let spriteSheet = null;

function resizeCanvas() {
    const canvas = document.getElementById("gameView");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (stage) {
        stage.width = canvas.width;
        stage.height = canvas.height;
    }
}

function createBackground(container, cardWidth, cardHeight) {
    const width = (margin + cardWidth) * 2 + margin;
    const height = (margin + cardHeight) * 2 + margin;
    const shape = new createjs.Shape();
    const graphics = shape.graphics;
    shape.x = 0;
    shape.y = 0;
    shape.width = width;
    shape.height = height;
    graphics.beginFill("#ae9bf2");
    graphics.beginStroke("#4e1d97");
    graphics.setStrokeStyle(2);
    graphics.drawRoundRect(0, 0, width, height, margin);
    container.addChild(shape);
    return shape;
}

function createCardBackground(container, cardWidth, cardHeight) {
    const shape = new createjs.Shape();
    const graphics = shape.graphics;
    shape.x = 0;
    shape.y = 0;
    shape.width = cardWidth;
    shape.height = cardHeight;
    graphics.beginFill("#e5eac4");
    graphics.beginStroke("#51612a");
    graphics.setStrokeStyle(2);
    graphics.drawRoundRect(0, 0, cardWidth, cardHeight, margin);
    container.addChild(shape);
    return shape;
}

function createGroupContainer(container, cardWidth, cardHeight) {
    const groupContainer = new createjs.Container();
    const background = createBackground(groupContainer, cardWidth, cardHeight);
    groupContainer.regX = background.width * 0.5;
    groupContainer.regY = background.height * 0.5;
    groupContainer.x = stage.width * 0.5;
    groupContainer.y = stage.height * 0.5;
    container.addChild(groupContainer);
    return groupContainer;
}

function createBombButton(container, cardWidth, cardHeight) {
    const card = createCardBackground(container, cardWidth, cardHeight);
    card.x = margin * 2 + cardWidth;
    card.y = margin * 2 + cardHeight;

    const startFrame = bombAnimations[0];

    const bombSprite = new createjs.Sprite(spriteSheet.spriteData, startFrame);
    bombSprite.framerate = 22;
    bombSprite.name = startFrame;
    bombSprite.visible = true;
    bombSprite.startTime = 0;
    bombSprite.animation = startFrame;
    bombSprite.loopCounter = 0;
    bombSprite.bombSound = null;

    let bombAnimation = spriteSheet.spriteData.getAnimation(startFrame);
    let frameData = spriteSheet.spriteData.getFrame(bombAnimation.frames[0]);
    const imageSize = {
        width: frameData.rect.width,
        height: frameData.rect.height
    };
    const scaleH = (cardHeight / imageSize.height) * 0.8;
    const scaleW = (cardWidth / imageSize.width) * 0.8;
    let buttonScale;
    if (scaleH > 1 || scaleW > 1) {
        buttonScale = Math.min(scaleW, scaleH);
    } else {
        buttonScale = Math.max(scaleW, scaleH);
    }

    bombSprite.setTransform((margin * 2) + cardWidth + (cardWidth * 0.5), (margin * 2) + cardHeight + (cardHeight * 0.5), buttonScale, buttonScale, 0, 0, 0, 0, 0); // imageSize.width * 0.5, imageSize.height * 0.5);
    container.addChild(bombSprite);
    bombSprite.gotoAndStop(startFrame);
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

function createCherriesButton(container, cardWidth, cardHeight) {
    const card = createCardBackground(container, cardWidth, cardHeight);
    card.x = margin;
    card.y = margin * 2 + cardHeight;
    const cherriesButton = new createjs.Bitmap(loadQueue.getResult("cherries"));
    const imageSize = {
        width: cherriesButton.image.width,
        height: cherriesButton.image.height
    };
    const scaleH = (cardHeight / imageSize.height) * 0.8;
    const scaleW = (cardWidth / imageSize.width) * 0.8;
    let buttonScale;
    if (scaleH > 1 || scaleW > 1) {
        buttonScale = Math.min(scaleW, scaleH);
    } else {
        buttonScale = Math.max(scaleW, scaleH);
    }

    cherriesButton.setTransform(margin + (cardWidth * 0.5), (margin * 2) + cardHeight + (cardHeight * 0.5), buttonScale, buttonScale, 0, 0, 0, cherriesButton.image.width * 0.5, cherriesButton.image.height * 0.5);
    container.addChild(cherriesButton);
    cherriesButton.addEventListener("click", function() {
        createjs.Tween.get(cherriesButton)
        .to({scaleX: buttonScale * 1.5, scaleY: buttonScale * 1.5},  200)
        .to({rotation: -22}, 100)
        .to({rotation: 0}, 100)
        .to({rotation: 22}, 100)
        .to({rotation: 0}, 100)
        .to({rotation: -22}, 100)
        .to({rotation: 0}, 100)
        .to({rotation: 22}, 100)
        .to({rotation: 0, scaleX: buttonScale, scaleY: buttonScale}, 200);
    });
}

function createJokerButton(container, cardWidth, cardHeight) {
    const card = createCardBackground(container, cardWidth, cardHeight);
    card.x = margin;
    card.y = margin;
    const jokerButton = new createjs.Bitmap(loadQueue.getResult("joker"));
    const imageSize = {
        width: jokerButton.image.width,
        height: jokerButton.image.height
    };
    const scaleH = (cardHeight / imageSize.height) * 0.8;
    const scaleW = (cardWidth / imageSize.width) * 0.8;
    let buttonScale;
    if (scaleH > 1 || scaleW > 1) {
        buttonScale = Math.min(scaleW, scaleH);
    } else {
        buttonScale = Math.max(scaleW, scaleH);
    }

    jokerButton.setTransform(margin + (cardWidth * 0.5), margin + (cardHeight * 0.5), buttonScale, buttonScale, 0, 0, 0, jokerButton.image.width * 0.5, jokerButton.image.height * 0.5);
    container.addChild(jokerButton);
    jokerButton.addEventListener("click", function() {
        createjs.Tween.get(jokerButton)
        .to({rotation: -15}, 200)
        .to({rotation: 15, scaleX: buttonScale * 0.5, scaleY: buttonScale * 0.5},  300)
        .to({rotation: -15, scaleX: buttonScale * 1.5, scaleY: buttonScale * 1.5}, 200)
        .to({rotation: 0, scaleX: buttonScale, scaleY: buttonScale}, 200);
    });
}

function createCoinButton(container, cardWidth, cardHeight) {
    const card = createCardBackground(container, cardWidth, cardHeight);
    card.x = margin * 2 + cardWidth;
    card.y = margin;

    const coinButton = new createjs.Bitmap(loadQueue.getResult("coin"));
    const imageSize = {
        width: coinButton.image.width,
        height: coinButton.image.height
    };
    const scaleH = (cardHeight / imageSize.height) * 0.64;
    const scaleW = (cardWidth / imageSize.width) * 0.64;
    const buttonScale = (scaleH > 1 || scaleW > 1) ? Math.min(scaleW, scaleH) : Math.max(scaleW, scaleH);

    coinButton.setTransform((margin * 2) + cardWidth + (cardWidth * 0.5), margin + (cardHeight * 0.5), buttonScale, buttonScale, 0, 0, 0, coinButton.image.width * 0.5, coinButton.image.height * 0.5);
    container.addChild(coinButton);
    coinButton.addEventListener("click", function() {
        coinButton.regX = coinButton.image.width * 0.5;
        coinButton.regY = coinButton.image.height * 0.5;
        createjs.Tween.get(coinButton)
        .to({skewY: 180}, 300)
        .to({skewY: 0}, 300)
        .to({skewY: -180}, 300)
        .to({skewY: 0}, 300);
    });
}

function createButtons(container) {
    const cardWidth = 160;
    const cardHeight = 200;
    const groupContainer = createGroupContainer(container, cardWidth, cardHeight);
    createJokerButton(groupContainer, cardWidth, cardHeight);
    createCoinButton(groupContainer, cardWidth, cardHeight);
    createCherriesButton(groupContainer, cardWidth, cardHeight);
    createBombButton(groupContainer, cardWidth, cardHeight);
}

function onEnterFrame(event) {
    stage.update(event);
}

function init() {
    stage = new createjs.Stage("gameView");
    resizeCanvas();
    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", onEnterFrame);
    window.addEventListener("resize", resizeCanvas);
    loadAssets();
}

function handleLoadComplete() {
    const spriteSheetName = "bomb-sprites-frames";
    const spriteSheetFrames = loadQueue.getResult(spriteSheetName);
    if (spriteSheetFrames != null) {
        spriteSheet = spriteSheetFrames;
        spriteSheet.images = [loadQueue.getResult("bomb-sprites")];
        spriteSheet.spriteData = new createjs.SpriteSheet(spriteSheetFrames);
    } else {
        console.error("Error: sprite sheet " + spriteSheetName + " was not loaded.");
    }

    resizeCanvas();
    createButtons(stage);
}

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
