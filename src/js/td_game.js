/*** Vector TD Game module - (c) mjh.at - v0.0.1 2016-08-10 ***/

var TDGame,
    TDConfig,
    TDRenderer,
    TDPath,
    TDGameState,
    TDUtil;

/*jslint devel: true, browser: true, nomen: true*/
(function (module) {
    "use strict";

    var _renderer, _gameState,
        lastFps = 0,
        timestamp, gameLoop, updateFps;


    module.frameCounter = 0;
    module.time = 0;

    timestamp = function () {
        return (window.performance && window.performance.now ?
                window.performance.now() : Date().now) / 1000;
    };

    /* Main game loop */

    gameLoop = function () {
        var now = timestamp(),
            timePassed = Math.min(1, now - module.time);

        window.requestAnimationFrame(gameLoop);

        // TODO: game logic


        // Render game
        _renderer.render(timePassed, _gameState);

        module.frameCounter += 1;
        module.time = now;
    };

    /* Entry point into the game */

    module.init = function () {

        var path;

        _renderer = new TDRenderer.Renderer();
        _gameState = new TDGameState.GameState();

        // TODO: Remove
        path = TDPath.findPath(_gameState, _gameState.grid[2][2], _gameState.grid[36][26]);
        _gameState.addPath(path);

        // Reset FPS counter every second
        setInterval(updateFps, 1000);

        // Start game loop
        module.time = timestamp();
        window.requestAnimationFrame(gameLoop);

    };

    /* FPS counters */

    updateFps = function () {
        lastFps = module.frameCounter;
        module.frameCounter = 0;
    };

    module.getFps = function () {
        return lastFps;
    };

}(TDGame = TDGame || {}));
