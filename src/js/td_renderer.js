/*** TD Renderer module - (c) mjh.at - v0.0.1 2016-08-10 ***/

var TDRenderer,
    TDConfig,
    TDGame;

/*jslint devel: true, browser: true, nomen: true*/
(function (module) {
    "use strict";

    var _Renderer, renderGameState, renderTiles, renderEnemyPaths,
        renderGrid, drawFps,
        canvas, ctx;

    module.Renderer = function () {

        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");

    };
    _Renderer = module.Renderer.prototype;

    _Renderer.render = function (timePassed, gameState) {

        ctx.clearRect(0, 0, TDConfig.renderer.width, TDConfig.renderer.height);

        renderGameState(gameState);

        renderGrid();

        drawFps();

    };

    renderGameState = function (gameState) {

        renderTiles(gameState.grid);
        renderEnemyPaths(gameState.enemyPaths);

    };

    renderTiles = function (grid) {
        var x, y, tile,
            tileSize = TDConfig.grid.tileSize;


        for (x = 0; x < grid.length; x += 1) {
            for (y = 0; y < grid[x].length; y += 1) {

                tile = grid[x][y];

                ctx.fillStyle = tile.color;
                ctx.fillRect(tileSize * x, tileSize * y, tileSize * (x + 1), tileSize * (y + 1));

            }
        }

    };

    renderEnemyPaths = function (enemyPaths) {
        var i, j, waypoints, lastPoint;


        if (enemyPaths.length === 0) {
            return;
        }

        for (i = 0; i < enemyPaths.length; i += 1) {

            lastPoint = null;
            waypoints = enemyPaths[i].waypoints;

            ctx.strokeStyle = TDConfig.style.enemyPath;
            ctx.fillStyle = TDConfig.style.enemyPath;
            ctx.lineWidth = 1;

            for (j = 0; j < waypoints.length; j += 1) {

                if (lastPoint) {
                    ctx.beginPath();
                    ctx.moveTo(lastPoint.cx, lastPoint.cy);
                    ctx.lineTo(waypoints[j].cx, waypoints[j].cy);
                    ctx.stroke();
                }

                ctx.beginPath();
                ctx.arc(waypoints[j].cx, waypoints[j].cy, 3, 0, 2 * Math.PI, false);
                ctx.fill();

                lastPoint = waypoints[j];
            }


        }


    };


    renderGrid = function () {
        var i, j;

        ctx.strokeStyle = TDConfig.style.grid;
        ctx.lineWidth = 1;

        ctx.beginPath();

        for (i = 0; i <= TDConfig.grid.width + 1; i += TDConfig.grid.tileSize) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, TDConfig.grid.height);
        }

        for (i = 0; i <= TDConfig.grid.height + 1; i += TDConfig.grid.tileSize) {
            ctx.moveTo(0, i);
            ctx.lineTo(TDConfig.grid.width, i);
        }

        ctx.stroke();

        if (TDConfig.grid.debug) {
            for (i = 0; i < TDConfig.grid.tilesX; i += 1) {
                for (j = 0; j <= TDConfig.grid.tilesY; j += 1) {
                    ctx.font = "normal 9px 'Lucida Console'";
                    ctx.textAlign = "left";
                    ctx.fillStyle = "#0F0";
                    ctx.fillText(i, i * TDConfig.grid.tileSize, j * TDConfig.grid.tileSize + 9);
                    ctx.fillText(j, i * TDConfig.grid.tileSize, j * TDConfig.grid.tileSize + 18);
                }
            }
        }

    };


    drawFps = function () {
        var fps = TDGame.getFps();

        ctx.font = "normal 9px 'Lucida Console'";
        ctx.textAlign = "right";
        ctx.fillStyle = "#0F0";
        ctx.fillText(" " + fps, TDConfig.renderer.width - 2, 10);
    };

}(TDRenderer = TDRenderer || {}));
