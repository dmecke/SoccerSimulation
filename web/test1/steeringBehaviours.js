var Vector2d = require('./vector2d');

function SteeringBehaviours(entity) {
    this.entity = entity;
    this.seekTarget = new Vector2d();

    this.calculate = function() {
        var steeringForce = new Vector2d();

        steeringForce.add(this.seekSteeringForce());

        steeringForce.truncate(this.entity.maxForce);

        return steeringForce;
    };

    this.seekSteeringForce = function() {
        if (this.seekTarget.distance(this.entity.position) < 30) {
            this.seekTarget.random(600, 400);
            console.log('new seek target (' + this.entity.color + '): ' + this.seekTarget.coords());
        }

        var desiredVelocity = this.seekTarget.clone();
        desiredVelocity = desiredVelocity.subtract(this.entity.position);
        desiredVelocity = desiredVelocity.normalize();
        desiredVelocity = desiredVelocity.multiply(this.entity.maxSpeed);
        desiredVelocity = desiredVelocity.subtract(this.entity.velocity);

        return desiredVelocity;
    }
}


module.exports = SteeringBehaviours;
