
var TDPath,
    TDConfig,
    TDUtil,
    TDGameState;

/*jslint devel: true, browser: true, nomen: true, continue: true*/
(function (module) {
    "use strict";

    var calcNextTile, checkTileIntersect, createWaypoint, astarCalculateWaypoints,
        astarHeuristicCostEstimate, astarTileSetContains, astarReconstructPath;

    module.findPath = function (gameState, startTile, destTile) {

        var tileSize = TDConfig.grid.tileSize, result = { waypoints : [] },
            pathStart, pathEnd, lastTile = null, currentTile, nextTile, occupied,
            occupiedState = false, astarWaypoints;

        pathStart = createWaypoint(startTile);
        pathEnd = createWaypoint(destTile);

        result.waypoints.push(pathStart);

        currentTile = startTile;

        do {

            nextTile = calcNextTile(currentTile, lastTile, pathStart, pathEnd);

            if (nextTile) {

                //console.log(nextTile.x, nextTile.y);
                //gameState.grid[nextTile.x][nextTile.y].color = "#330";

                lastTile = currentTile;
                currentTile = nextTile;

                occupied = gameState.grid[nextTile.x][nextTile.y].occupied;

                if (occupied !== occupiedState) {
                    occupiedState = occupied;

                    if (occupiedState) {
                        result.waypoints.push(createWaypoint(lastTile));
                    } else {

                        astarWaypoints = astarCalculateWaypoints(
                            gameState,
                            result.waypoints[result.waypoints.length - 1].tile,
                            nextTile
                        );

                        if (astarWaypoints) {
                            result.waypoints = result.waypoints.concat(astarWaypoints);
                        } else {
                            console.error("Could not calculate A* path!");
                        }

                        //result.waypoints.push(createWaypoint(nextTile));
                    }
                }

            }

        } while (nextTile);

        result.waypoints.push(pathEnd);

        return result;

    };

    createWaypoint = function (tile) {
        var tileSize = TDConfig.grid.tileSize;

        return {
            cx : tile.x * tileSize + (tileSize / 2),
            cy : tile.y * tileSize + (tileSize / 2),
            tile : tile
        };

    };

    calcNextTile = function (currentTile, lastTile, pathStart, pathEnd) {

        var intersectResult;

        intersectResult = checkTileIntersect(currentTile, lastTile, pathStart, pathEnd, 0, -1);
        if (intersectResult) { return intersectResult; }

        intersectResult = checkTileIntersect(currentTile, lastTile, pathStart, pathEnd, 1, 0);
        if (intersectResult) { return intersectResult; }

        intersectResult = checkTileIntersect(currentTile, lastTile, pathStart, pathEnd, 0, 1);
        if (intersectResult) { return intersectResult; }

        intersectResult = checkTileIntersect(currentTile, lastTile, pathStart, pathEnd, -1, 0);
        if (intersectResult) { return intersectResult; }

        return null;

    };


    checkTileIntersect = function (currentTile, lastTile, pathStart, pathEnd, xdiff, ydiff) {
        var tileSize = TDConfig.grid.tileSize, borderx1, bordery1, borderx2, bordery2,
            intersectResult;

        if (lastTile) {
            if (currentTile.x + xdiff === lastTile.x && currentTile.y + ydiff === lastTile.y) {
                return null;
            }
        }

        borderx1 = currentTile.x * tileSize + (xdiff === 1 ? tileSize : 0);
        bordery1 = currentTile.y * tileSize + (ydiff === 1 ? tileSize : 0);
        borderx2 = currentTile.x * tileSize + (xdiff === -1 ? 0 : tileSize);
        bordery2 = currentTile.y * tileSize + (ydiff === -1 ? 0 : tileSize);

        intersectResult = TDUtil.checkLineIntersection(
            pathStart.cx,
            pathStart.cy,
            pathEnd.cx,
            pathEnd.cy,
            borderx1,
            bordery1,
            borderx2,
            bordery2
        );

        console.log(
            "InterSect:",
            currentTile.x,
            currentTile.y,
            lastTile ? lastTile.x : null,
            lastTile ? lastTile.y : null,
            xdiff,
            ydiff,
            "Check:",
            pathStart.cx,
            pathStart.cy,
            pathEnd.cx,
            pathEnd.cy,
            borderx1,
            bordery1,
            borderx2,
            bordery2,
            "Result:",
            intersectResult
        );

        if (intersectResult.intersect) {
            return { x : currentTile.x + xdiff, y : currentTile.y + ydiff };
        }

        return null;
    };

    astarCalculateWaypoints = function (gameState, startTile, goalTile) {
        var tilesX = TDConfig.grid.tilesX, tilesY = TDConfig.grid.tilesY,
            openSet = [startTile],
            closed = TDUtil.createMatrix(tilesX, tilesY, function (i, j) { return false; }),
            cameFrom = TDUtil.createMatrix(tilesX, tilesY, function (i, j) { return null; }),
            gScore = TDUtil.createMatrix(tilesX, tilesY, function (i, j) { return 999999; }),
            fScore  = TDUtil.createMatrix(tilesX, tilesY, function (i, j) { return 999999; }),
            i, j, minIndex, minValue, tile, neighbor, tentativeGScore, x, y;

        gScore[startTile.x][startTile.y] = 0;
        fScore[startTile.x][startTile.y] = astarHeuristicCostEstimate(startTile, goalTile);

        while (openSet.length > 0) {

            minIndex = -1;
            minValue = 9999999;
            for (i = 0; i < openSet.length; i += 1) {
                tile = openSet[i];
                if (fScore[tile.x][tile.y] < minValue) {
                    minIndex = i;
                    minValue = fScore[tile.x][tile.y];
                }
            }

            tile = openSet[minIndex];
            x = tile.x;
            y = tile.y;

            if (x === goalTile.x && y === goalTile.y) {
                return astarReconstructPath(cameFrom, tile);
            }

            openSet.splice(minIndex, 1);
            closed[tile.x][tile.y] = true;

            for (i = -1; i <= 1; i += 1) {
                for (j = -1; j <= 1; j += 1) {

                    neighbor = { x : x + i, y : y + j };

                    if ((i === 0 && j === 0) ||
                            neighbor.x < 0 || neighbor.y < 0 ||
                            neighbor.x >= tilesX || neighbor.y >= tilesY ||
                            closed[neighbor.x][neighbor.y]) {
                        continue;
                    }

                    if (gameState.grid[neighbor.x][neighbor.y].occupied) {
                        continue;
                    }

                    tentativeGScore = gScore[x][y] + TDUtil.distance(x, y, neighbor.x, neighbor.y);

                    if (!astarTileSetContains(openSet, neighbor)) {
                        openSet.push(neighbor);
                    } else if (tentativeGScore >= gScore[neighbor.x][neighbor.y]) {
                        continue;
                    }

                    cameFrom[neighbor.x][neighbor.y] = tile;
                    gScore[neighbor.x][neighbor.y] = tentativeGScore;
                    fScore[neighbor.x][neighbor.y] = tentativeGScore +
                        astarHeuristicCostEstimate(neighbor, goalTile);
                }
            }

        }   // while (openSet.length > 0)

        return null;

    };

    astarHeuristicCostEstimate = function (tileA, tileB) {
        return TDUtil.distance(tileA.x, tileA.y, tileB.x, tileB.y);
    };

    astarTileSetContains = function (tileSet, tile) {
        var i, t;
        for (i = 0; i < tileSet.length; i += 1) {
            t = tileSet[i];
            if (t.x === tile.x && t.y === tile.y) {
                return true;
            }
        }
        return false;
    };

    astarReconstructPath = function (cameFrom, goalTile) {
        var path = [createWaypoint(goalTile)],
            nextTile;

        nextTile = cameFrom[goalTile.x][goalTile.y];

        while (nextTile) {
            path.unshift(createWaypoint(nextTile));
            nextTile = cameFrom[nextTile.x][nextTile.y];
        }

        return path;
    };


/*
        var pos, neighborRates, r, neighborTile;

        gameState.grid[start.x][start.y].color = "#090";
        gameState.grid[destination.x][destination.y].color = "#900";

        pos = { x : start.x, y : start.y };

        while (pos.x !== destination.x || pos.y !== destination.y) {


            neighborRates = rateNeighbors(pos, start, destination);

            for (r = 0; r < neighborRates.length; r += 1) {

                neighborTile = gameState.grid[neighborRates[r].x][neighborRates[r].y];

                if (!neighborTile.occupied) {
                    pos.x = neighborTile.x;
                    pos.y = neighborTile.y;

                    neighborTile.color = "#990";

                    break;
                }
            }


            TDUtil.log("Pos: ", pos.x, pos.y);

        }

    };


    rateNeighbors = function (pos, start, destination) {
        var x, y, rateX, rateY, rate, r, result = [],
            maxX = TDConfig.grid.tilesX - 1,
            maxY = TDConfig.grid.tilesY - 1;

        for (x = -1; x <= 1; x += 1) {
            for (y = -1; y <= 1; y += 1) {

                rateX = pos.x + x;
                rateY = pos.y + y;

                if (rateX >= 0 && rateX <= maxX && rateY >= 0 && rateY <= maxY &&
                        (x !== 0 || y !== 0)) {

                    rate = {
                        x : rateX,
                        y : rateY,
                        d : TDUtil.distance(rateX, rateY, destination.x, destination.y)
                            //+ TDUtil.pointToLineDistance(rateX, rateY, start.x, start.y, destination.x, destination.y)
                    };

                    //TDUtil.log("rate: ", rate);

                    if (result.length === 0) {
                        result[0] = rate;
                    } else {
                        for (r = 0; r < result.length; r += 1) {
                            if (result[r].d > rate.d) {
                                result.splice(r, 0, rate);
                                break;
                            }
                        }
                    }

                }
            }
        }

        //TDUtil.log("FINAL rateNeighbors: ", result);
        return result;

    };
*/

}(TDPath = TDPath || {}));
