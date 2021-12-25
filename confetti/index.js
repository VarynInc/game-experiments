/**
 * Simulate a confetti animation.
 */
function resizeCanvas() {
    const canvas = document.getElementById("gameView");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function init() {
    const stage = new createjs.Stage("gameView");
    const container = new createjs.Container();
    const numberOfChips = 2000;
    const minSpeed = 2.0;
    const maxSpeed = 8.0;

    resizeCanvas();
    stage.addChild(container);

    function createChip() {
        var color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
        var object = new createjs.Shape();
        var width = Math.floor(Math.random() * (6.5 - 2 + 1)) + 2
        var height = Math.floor(Math.random() * (8 - 3 + 1)) + 3
        object.graphics.f(color)
            .r(0, 0, width, height);
        object.alpha = 0.8;
        object.width = width;
        object.height = height;
        object.setTransform(Math.random() * stage.canvas.width, 0, 1, 1, Math.random() * 180);
        return object;
    }

    function confettiAnimate() {
        container.removeAllChildren();
        for (var i = 0; i < numberOfChips; i++) {
            var object = createChip();
            object.x = object.x + (Math.random() * (stage.canvas.width * 0.25)) - (stage.canvas.width * 0.25);
            object.y = 0; // stage.canvas.height;
            object.rotation = Math.random() * 360 - 180;
            object.dx = (Math.random() * 4) - 2;
            object.dy = (Math.random() * maxSpeed) + minSpeed;
            object.dRotation = (Math.random() * 4) - 2;
            object.dAlpha = 0.01;
            container.addChild(object);
        }
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
                            confettiAnimate();
                        }
                    }
                }
            }
        }
        stage.update();
    }

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", onEnterFrame);
    window.addEventListener("resize", resizeCanvas);
    confettiAnimate();
}
