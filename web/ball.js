var MovingEntity = require('./movingEntity');
var util = require('util');

Ball.prototype = new MovingEntity();
function Ball() {
    MovingEntity.call(this);

    this.update = function() {
        this.steeringBehaviours.update();
    };

    this.toJSON = function() {
        return {
            'color': this.color,
            'position': this.position,
            'headingPosition' : this.headingPosition,
            'currentTarget': this.steeringBehaviours.currentTarget
        }
    };
}
util.inherits(Ball, MovingEntity);

module.exports = Ball;
