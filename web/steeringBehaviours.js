var Vector2d = require('./vector2d');

function SteeringBehaviours(player) {
    this.player = player;

    this.seekSteeringForce = function(target) {
        steeringForce = target.clone();               // take the current target
        steeringForce.subtract(this.player.position); // calculate the vector from current position to the target
        steeringForce.normalize();                    // make this vector normalized
        steeringForce.multiply(this.player.maxSpeed); // make this vector the length of max speed
        steeringForce.subtract(this.player.velocity); // subtract the current velocity

        return steeringForce;
    };

    this.arriveSteeringForce = function(target) {
        var toTarget = target.clone();
        toTarget.subtract(this.player.position); // calculate the vector from current position to the target
        var distance = toTarget.length();        // calculate the distance between current and target position

        if (distance > 0) {
            var decelerationTweaker = 3;
            var speed = distance / decelerationTweaker; // calculate the speed needed to reach the target
            speed = Math.min(speed, this.player.maxSpeed);               // avoid being faster than the maximum

            steeringForce = toTarget.clone();             // take the toTarget vector
            steeringForce.multiply(speed);                // move as fast as possible
            steeringForce.divide(distance);               // but not too far
            steeringForce.subtract(this.player.velocity); // subtract the current velocity

            return steeringForce;
        }

        return new Vector2d(0, 0);
    };

    this.separationSteeringForce = function() {
        var steeringForce = new Vector2d(0, 0);
        for (var i = 0; i < this.player.neighbours.length; i++) {
            var toNeighbour = this.player.position.clone();
            var neighbourPosition = this.player.neighbours[i].position.clone();

            toNeighbour.subtract(neighbourPosition);
            var length = toNeighbour.length();
            if (length != 0) {
                toNeighbour.normalize();
                var separationTweaker = 100;
                toNeighbour.divide(length / separationTweaker);
                steeringForce.add(toNeighbour);
            }

        }
        return steeringForce;
    };

    this.toJSON = function() {
        return {};
    }
}

module.exports = SteeringBehaviours;
