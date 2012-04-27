var MovingEntity = require('./movingEntity');
var util = require('util');

Ball.prototype = new MovingEntity();
function Ball() {
    MovingEntity.call(this);
    this.radius = 10;
    this.mass = 0.1;

    this.update = function() {
        this.steeringBehaviours.update();
        this.velocity.divide(1.1);
    };

    this.kick = function(direction, force) {
        var acceleration = direction.clone();
        acceleration.normalize();
        acceleration.multiply(force);
        acceleration.divide(this.mass);
        this.velocity = acceleration;
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
