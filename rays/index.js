/**
 * Sun ray animation.
 */

function resizeCanvas() {
    const canvas = document.getElementById("gameView");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function init() {
    const stage = new createjs.Stage("gameView");
    const container = new createjs.Container();
    container.name = "container";
    resizeCanvas();
    container.setTransform(stage.canvas.width * 0.5, stage.canvas.height, 1, 1, 0, 0, 0, stage.canvas.width * 0.5, stage.canvas.height);
    container.alpha = 0.3;
    stage.addChild(container);

    function createRay() {
        var color = "#ffffff";
        var rayShape = new createjs.Shape();
        var width = 20;
        var height = 100;
        var graphics = rayShape.graphics;
        graphics.beginLinearGradientFill([createjs.Graphics.getRGB(255, 255, 255, 0.2), createjs.Graphics.getRGB(255, 255, 255, 0.01)], [1, .01], 0, 0, 0, height);
        graphics.moveTo(0, 0);
        graphics.lineTo(width, 0);
        graphics.lineTo(width * 0.5, height);
        graphics.lineTo(0, 0);
        rayShape.alpha = 1;
        rayShape.width = width;
        rayShape.height = height;
        return rayShape;
    }

    function makeRays() {
        var numberOfRays = 180 / 18;
        var ray;
        var scaleFactor;
        var rotation = 0;
        var xCenter = stage.canvas.width * 0.5;

        for (var i = -1 * numberOfRays; i < numberOfRays; i++) {
            ray = createRay();
            rotation = i * 18;
            scaleFactor = Math.max(stage.canvas.height, stage.canvas.width) / ray.height;
            ray.setTransform(xCenter, stage.canvas.height, scaleFactor, scaleFactor, rotation, 0, 0, ray.width * 0.5, ray.height);
            container.addChild(ray);
        }
    }

    function onEnterFrame(event) {
        stage.update();
    }

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", onEnterFrame);
    window.addEventListener("resize", resizeCanvas);
    makeRays();
    createjs.Tween.get(container, { loop: -1 }).to({ rotation: 90 }, 5000);
}