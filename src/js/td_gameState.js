/*** TD GameState module - (c) mjh.at - v0.0.1 2016-08-10 ***/

var TDGameState,
    TDUtil,
    TDGame,
    TDConfig;

/*jslint devel: true, browser: true, nomen: true*/
(function (module) {
    "use strict";

    var _GameState, _Tile;

    module.GameState = function () {

        this.initGrid();

    };
    _GameState = module.GameState.prototype;

    _GameState.initGrid = function () {

        this.grid = TDUtil.createMatrix(
            TDConfig.grid.tilesX,
            TDConfig.grid.tilesY,
            function (i, j) {
                return new module.Tile(i, j);
            }
        );

        this.enemyPaths = [];

    };

    _GameState.addPath = function (path) {
        this.enemyPaths.push(path);
    };

    _GameState.clearPaths = function () {
        this.enemyPaths = [];
    };

    // ----

    module.Tile = function (x, y) {
        this.x = x;
        this.y = y;
        this.index = x * TDConfig.grid.tilesX + y;

        this.occupied = false;


        // TEST CODE FROM HERE ON
        this.color = "#000";

        if (x >= 15 && x <= 18 && y >= 5 && y <= 23) {
            this.occupied = true;
            this.color = "#666";
        }

        if (x >= 19 && x <= 21 && y >= 5 && y <= 8) {
            this.occupied = true;
            this.color = "#666";
        }


        if (x >= 28 && x <= 29 && y >= 2 && y <= 27) {
            this.occupied = true;
            this.color = "#666";
        }


    };
    _Tile = module.Tile.prototype;


}(TDGameState = TDGameState || {}));
