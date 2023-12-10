/**
 * Lotto balls animation using Box2d planck.js library.
 * Simulation at https://piqnt.com/space/tf4QuUY__
 */
const framerate = 60;
const COUNT = 21;
let totalSpawned = 0;
let nextSpawnTime = 0;
let canvas;
let stage;
let stageWidth;
let stageHeight;
let loader;
let backgroundShape = null;
const Vec2 = planck.Vec2;
const worldScale = 100; // 100 pixels per box2d 1 meter
const diameter = 4.0;
let ballImage;
let circle;
let world;
let windUp;
let windRight;
let windLeft;

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
        { src: "ping-pong-ball-72.png", id: "ball-sprite" }
    ],
    true,
    "./");
}

function createSprites() {
    circle = planck.Circle(diameter);
    const ballAsset = loader.getResult("ball-sprite");
    ballImage = new createjs.Bitmap(ballAsset);

    const width = 5.0;
    const box = world.createBody({
        type: 'static',
        position: Vec2(0.0, -25.0),
        bullet: false
    });
    box.createFixture(planck.Box(width, width), 0.0);
    const shape = new createjs.Shape();
    shape.graphics.f("#0c0c0c").r(0, 0, width, width);
    shape.name = "box";
    stage.addChild(shape);
    box.setUserData(shape);
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
    createWorld();
    createSprites();
    createjs.Ticker.addEventListener("tick", onEnterFrame);
    stage.update();
}

function createWorld() {
    const gravity = Vec2(0.0, -40.0);
    world = new planck.World({
        gravity: gravity
    });

    windUp = Vec2(5, 140);
    windRight = Vec2(80, 10);
    windLeft = Vec2(-80, 10);

    const ground = world.createBody();
    ground.createFixture(planck.Edge(Vec2(-40.0, -30.0), Vec2(40.0, -30.0)), 0.0);
    ground.createFixture(planck.Edge(Vec2(-40.0, -30.0), Vec2(-40.0, 50.0)), 0.0);
    ground.createFixture(planck.Edge(Vec2(40.0, -30.0), Vec2(40.0, 50.0)), 0.0);
    ground.createFixture(planck.Edge(Vec2(-40.0, 50.0), Vec2(40.0, 50.0)), 0.0);

    nextSpawnTime = Date.now();
}

function createBall() {
    const body = world.createDynamicBody(Vec2(-40.0 + diameter + 1, 50.0 - diameter - 1));
    body.createFixture(circle, {
        density: 0.05,
        restitution: 0.8
    });

    const ball = new createjs.Sprite();
    body.setUserData(ball);
}

function onEnterFrame(tickEvent) {
    const deltaTime = tickEvent.delta / 1000;
    const now = Date.now();
    let body;

    world.step(deltaTime);
    if (totalSpawned <= COUNT && nextSpawnTime <= now) {
        // createBall();
        totalSpawned += 1;
        nextSpawnTime = now + 2000;
    }
    for (body = world.getBodyList(); body; body = body.getNext()) {
        if (body.getPosition().y < -25.0) {
            body.applyLinearImpulse(windUp, body.getPosition(), true);
            if (body.getPosition().x < -30.0) {
                body.applyLinearImpulse(windRight, body.getPosition(), true);
            } else if (body.getPosition().x > 30.0) {
                body.applyLinearImpulse(windLeft, body.getPosition(), true);
            }
        }
        let sprite = body.getUserData();
        if (sprite) {
            let bodyPosition = body.getPosition();
            sprite.x = bodyPosition.x * worldScale;
            sprite.y = bodyPosition.y * worldScale;
            sprite.rotation = body.getAngle();
        }
    }
    stage.update(tickEvent);
}
