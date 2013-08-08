var Vector2d = require('./vector2d');
var C2dMatrix = require('./c2dMatrix');

function Helper() {
    this.vec2dRotateAroundOrigin = function(vector, angle) {
        var x = ((vector.x - 0) * Math.cos(angle)) - ((0 - vector.y) * Math.sin(angle));
        var y = ((0 - vector.y) * Math.cos(angle)) - ((vector.x - 0) * Math.sin(angle));

        vector.x = x;
        vector.y = y;
    };

    this.pointToLocalSpace = function(point, agentHeading, agentSide, agentPosition) {

        var transPoint = point.clone();
        var localAgentHeading = agentHeading.clone();
        var localAgentSide = agentSide.clone();
        var localAgentPosition = agentPosition.clone();

        //create a transformation matrix
        var transformationMatrix = new C2dMatrix();

        var tx = -localAgentPosition.dot(localAgentHeading);
        var ty = -localAgentPosition.dot(localAgentSide);

        //create the transformation matrix
        transformationMatrix._11 = localAgentHeading.x;
        transformationMatrix._12 = localAgentSide.x;
        transformationMatrix._21 = localAgentHeading.y;
        transformationMatrix._22 = localAgentSide.y;
        transformationMatrix._31 = tx;
        transformationMatrix._32 = ty;

        //now transform the vertices
        transformationMatrix.transformVector2Ds(transPoint);

        return transPoint;
    };
}
module.exports = Helper;
