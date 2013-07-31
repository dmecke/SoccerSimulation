var Vector2d = require('./vector2d');

function Util() {
    this.vec2dRotateAroundOrigin = function(vector, angle) {
        var x = ((vector.x - 0) * Math.cos(angle)) - ((0 - vector.y) * Math.sin(angle));
        var y = ((0 - vector.y) * Math.cos(angle)) - ((vector.x - 0) * Math.sin(angle));

        vector.x = x;
        vector.y = y;
    }
}
module.exports = Util;
