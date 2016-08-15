/*** TD Util module - (c) mjh.at - v0.0.1 2016-08-10 ***/

var TDUtil;

/*jslint devel: true, browser: true, nomen: true*/
(function (module) {
    "use strict";

    var DEBUG = true;

    module.log = function () {
        if (DEBUG) {
            console.log(arguments);
        }
    };

    module.distance = function (x1, y1, x2, y2) {
        return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
    };

    module.distanceSquared = function (x1, y1, x2, y2) {
        return (x2 -= x1) * x2 + (y2 -= y1) * y2;
    };

    // http://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
    module.pointToLineDistance = function (xp, yp, x1, y1, x2, y2) {
        var lineDistanceSquared, t;

        lineDistanceSquared = module.distanceSquared(x1, y1, x2, y2);
        if (lineDistanceSquared === 0) {
            return module.distanceSquared(xp, yp, x1, y1);
        }

        t = ((xp - x1) * (x2 - x1) + (yp - y1) * (y2 - y1)) / lineDistanceSquared;
        t = Math.max(0, Math.min(1, t));

        return module.distance(xp, yp, x1 + t * (x2 - x1), y1 + t * (y2 - y1));
    };

    module.checkLineIntersection = function (px1, py1, px2, py2, qx1, qy1, qx2, qy2) {
        var d, a, b, num1, num2,
            result = {
                x: null,
                y: null,
                intersect: false
            };

        d = ((qy2 - qy1) * (px2 - px1)) - ((qx2 - qx1) * (py2 - py1));

        if (d === 0) {
            return result;
        }

        a = py1 - qy1;
        b = px1 - qx1;
        num1 = ((qx2 - qx1) * a) - ((qy2 - qy1) * b);
        num2 = ((px2 - px1) * a) - ((py2 - py1) * b);
        a = num1 / d;
        b = num2 / d;

        result.x = px1 + (a * (px2 - px1));
        result.y = py1 + (a * (py2 - py1));

        if (a >= 0 && a < 1 && b >= 0 && b < 1) {
            result.intersect = true;
        }

        //console.log(a, b);

        return result;
    };


    module.createMatrix = function (countI, countJ, valueFunc) {
        var i, j, result = [];

        for (i = 0; i < countI; i += 1) {
            result[i] = [];
            for (j = 0; j < countJ; j += 1) {
                result[i][j] = valueFunc(i, j);
            }
        }

        return result;
    };


}(TDUtil = TDUtil || {}));
