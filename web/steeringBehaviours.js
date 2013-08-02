var Vector2d = require('./vector2d');
var Param = require('./param');

function SteeringBehaviours(entity) {
    this.entity = entity;
    this.currentTarget = new Vector2d(600, 300);
    this.seek = false;
    this.arrive = false;
    this.separation = false;
    this.interpose = false;
    this.pursuit = false;

    this.seekSteeringForce = function(target) {
        steeringForce = target.clone();               // take the current target
        steeringForce.subtract(this.entity.position); // calculate the vector from current position to the target
        steeringForce.normalize();                    // make this vector normalized
        steeringForce.multiply(this.entity.maxSpeed); // make this vector the length of max speed
        steeringForce.subtract(this.entity.velocity); // subtract the current velocity

        return steeringForce;
    };

    /**
     * @param target
     * @param decelerationFactor (3: slow / 2: normal / 1: fast)
     */
    this.arriveSteeringForce = function(target, decelerationFactor) {
        var toTarget = target.clone();
        toTarget.subtract(this.entity.position); // calculate the vector from current position to the target
        var distance = toTarget.length();        // calculate the distance between current and target position

        if (distance > 0) {
            var decelerationTweaker = 1.5 * decelerationFactor;
            var speed = distance / decelerationTweaker; // calculate the speed needed to reach the target
            speed = Math.min(speed, this.entity.maxSpeed);               // avoid being faster than the maximum

            steeringForce = toTarget.clone();             // take the toTarget vector
            steeringForce.multiply(speed);                // move as fast as possible
            steeringForce.divide(distance);               // but not too far
            steeringForce.subtract(this.entity.velocity); // subtract the current velocity

            return steeringForce;
        }

        return new Vector2d(0, 0);
    };

    this.separationSteeringForce = function() {
        var steeringForce = new Vector2d(0, 0);
        for (var i = 0; i < this.entity.neighbours.length; i++) {
            var toNeighbour = this.entity.position.clone();
            var neighbourPosition = this.entity.neighbours[i].position.clone();

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

    this.interposeSteeringForce = function(ball, target, distanceFromTarget) {
        var ballPosition = ball.position.clone();

        return this.arriveSteeringForce(ballPosition.subtract(target).normalize().multiply(distanceFromTarget).add(target), 1);
    };

    this.pursuitSteeringForce = function(ball) {
        var ballPosition = ball.position.clone();
        var toBall = ballPosition.subtract(this.entity.position);
        var lookAheadTime = 0;

        if (ball.speed() != 0) {
            lookAheadTime = toBall.length() / ball.speed();
        }

        var target = ball.futurePosition(lookAheadTime);

        return this.arriveSteeringForce(target, 1);
    };

    this.update = function() {
        var steeringForce = new Vector2d(0, 0);
        if (this.seek) {
            steeringForce.add(this.seekSteeringForce(this.currentTarget));
        }
        if (this.arrive) {
            steeringForce.add(this.arriveSteeringForce(this.currentTarget, 2));
        }
        if (this.separation) {
            steeringForce.add(this.separationSteeringForce());
        }
        if (this.interpose) {
            steeringForce.add(this.interposeSteeringForce(this.entity.team.pitch.ball, this.currentTarget, new Param().GoalKeeperTendingDistance));
        }
        if (this.pursuit) {
            steeringForce.add(this.pursuitSteeringForce(this.entity.team.pitch.ball));
        }

        steeringForce.truncate(this.entity.maxForce);
        steeringForce.divide(this.entity.mass);

        this.entity.updateVelocity(steeringForce);
        this.entity.updatePosition();
        this.entity.updateHeading();
    };

    this.isAtCurrentTarget = function() {
        return this.entity.position.distanceSq(this.currentTarget) < 100;
    };

    this.toJSON = function() {
        return {};
    }
}

module.exports = SteeringBehaviours;
