function SteeringBehaviours(player) {
    this.player = player;

    this.seekSteeringForce = function(target) {
        steeringForce = target.clone();
        steeringForce.subtract(this.player.position);
        steeringForce.normalize();
        steeringForce.multiply(this.player.maxSpeed);
        steeringForce.subtract(this.player.velocity);

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

    this.toJSON = function() {
        return {};
    }
}

module.exports = SteeringBehaviours;
