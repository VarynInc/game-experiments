/**
 * Simulate a bomb explosion animation.
 */

let stage = null;
let container = null;

function resizeCanvas() {
    const canvas = document.getElementById("gameView");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createBomb() {
    const sprite = new createjs.Sprite();
    return sprite;
}

function onEnterFrame(event) {
    for (let i = container.children.length; i >= 0; i--) {
        let object = container.getChildAt(i);
        if (object) {
            if (object.y < (stage.canvas.height - object.height)) {
                object.x += object.dx;
                object.y += object.dy;
                object.rotation += object.dRotation;
            } else {
                object.y = stage.canvas.height - object.height;
                object.alpha -= object.dAlpha;
                if (object.alpha <= 0) {
                    container.removeChildAt(i);
                    if (container.children.length < 1) {
                    }
                }
            }
        }
    }
    stage.update();
}

function init() {
    stage = new createjs.Stage("gameView");
    container = new createjs.Container();

    resizeCanvas();
    stage.addChild(container);

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", onEnterFrame);
    window.addEventListener("resize", resizeCanvas);
}
