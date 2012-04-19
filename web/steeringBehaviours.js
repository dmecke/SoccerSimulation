var Vector2d = require('./vector2d');

function SteeringBehaviours(player) {
    this.player = player;
    this.currentTarget = new Vector2d(300, 200);
    this.seek = false;
    this.arrive = false;
    this.separation = false;
    this.interpose = false;
    this.pursuit = false;

    this.seekSteeringForce = function(target) {
        steeringForce = target.clone();               // take the current target
        steeringForce.subtract(this.player.position); // calculate the vector from current position to the target
        steeringForce.normalize();                    // make this vector normalized
        steeringForce.multiply(this.player.maxSpeed); // make this vector the length of max speed
        steeringForce.subtract(this.player.velocity); // subtract the current velocity

        return steeringForce;
    };

    /**
     * @param target
     * @param decelerationFactor (3: slow / 2: normal / 1: fast)
     */
    this.arriveSteeringForce = function(target, decelerationFactor) {
        var toTarget = target.clone();
        toTarget.subtract(this.player.position); // calculate the vector from current position to the target
        var distance = toTarget.length();        // calculate the distance between current and target position

        if (distance > 0) {
            var decelerationTweaker = 1.5 * decelerationFactor;
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

    this.interposeSteeringForce = function(playerA, playerB) {

        // calculate the current midpoint of both target players
        var currentMidpoint = playerA.position.clone();
        currentMidpoint.add(playerB.position);
        currentMidpoint.divide(2);

        // calculate the time to reach this current midpoint
        var distanceToCurrentMidpoint = this.player.position.distance(currentMidpoint);
        var timeToReachCurrentMidpoint = distanceToCurrentMidpoint / this.player.maxSpeed;

        // calculate player a's position after the needed time when it goes streight on
        var playerAFuturePosition = playerA.position.clone();
        var playerADistance = playerA.velocity.clone();
        playerADistance.multiply(timeToReachCurrentMidpoint);
        playerAFuturePosition.add(playerADistance);

        // calculate player b's position after the needed time when it goes streight on
        var playerBFuturePosition = playerB.position.clone();
        var playerBDistance = playerB.velocity.clone();
        playerBDistance.multiply(timeToReachCurrentMidpoint);
        playerBFuturePosition.add(playerBDistance);

        // calculate future midpoint
        var midpoint = playerAFuturePosition.clone();
        midpoint.add(playerBFuturePosition);
        midpoint.divide(2);

        // arrive fast at the calculated position
        return this.arriveSteeringForce(midpoint, 1)
    };

    this.pursuitSteeringForce = function(evader) {

        // calculate the vector to the evader
        var toEvader = evader.position.clone();
        toEvader.subtract(this.player.position);

        // calculate whether the evader is right in front of use and heading (acos 0.95 = 18 degs)
        var relativeHeading = this.player.heading.dot(evader.heading);
        if (toEvader.dot(this.player.heading) > 0 && relativeHeading < -0.95) {
            return this.seekSteeringForce(evader.position);
        }

        var evaderLength = evader.position.length();
        var lookAheadTime = evaderLength / (this.player.maxSpeed + evader.velocity.length());

        var seekTarget = evader.position.clone();
        var evaderVelocity = evader.velocity.clone();
        evaderVelocity.multiply(lookAheadTime);
        seekTarget.add(evaderVelocity);

        return this.seekSteeringForce(seekTarget);
    };

    this.update = function() {
        if (this.isAtCurrentTarget()) {
            this.currentTarget.x = Math.random() * 600;
            this.currentTarget.y = Math.random() * 400;
        }

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
            steeringForce.add(this.interposeSteeringForce(this.player.world.players[0], this.player.world.players[1]));
        }
        if (this.pursuit) {
            steeringForce.add(this.pursuitSteeringForce(this.player.world.players[0]));
        }

        steeringForce.truncate(this.player.maxForce);
        steeringForce.divide(this.player.mass);

        this.player.updateVelocity(steeringForce);
        this.player.updatePosition();
        this.player.updateHeading();
        this.player.updateHeadingPosition();
    };

    this.isAtCurrentTarget = function() {
        return this.player.position.distanceSq(this.currentTarget) < 100;
    };

    this.toJSON = function() {
        return {};
    }
}

module.exports = SteeringBehaviours;
