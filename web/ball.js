var MovingEntity = require('./movingEntity');
var util = require('util');

Ball.prototype = new MovingEntity();
function Ball() {
    MovingEntity.call(this);
    this.radius = 10;
    this.mass = 1;
    this.friction = -0.015;
    this.playerKickingAccuracy = 0.99; // range from 0 to 1 - the lower the worse the players get

    this.update = function() {
        this.steeringBehaviours.update();

        // simulate friction
        if (this.velocity.lengthSq() > Math.pow(this.friction, 2)) {
            var frictionVector = this.velocity.clone();
            frictionVector.multiply(this.friction);
            this.velocity.add(frictionVector);
        }
    };

    this.kick = function(direction, force) {
        var acceleration = direction.clone();
        acceleration.normalize();
        acceleration.multiply(force);
        acceleration.divide(this.mass);
        this.velocity = acceleration;
    };

    this.timeToCoverDistance = function(spotA, spotB, force) {
        var speed = force / this.mass;


        var distanceToCover = spotA.distance(spotB);

        // v^2 = u^2 + 2*a*s
        var term = speed * speed + 2 * distanceToCover * this.friction;

        // ball can never reach spotB
        if (term < 0) {
            return -1;
        }

        var v = Math.sqrt(term);

        // t = (v - u) / a
        return (v - speed) / this.friction;
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
