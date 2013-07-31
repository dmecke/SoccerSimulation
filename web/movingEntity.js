var Vector2d = require('./vector2d');
var SteeringBehaviours = require('./steeringBehaviours');

function MovingEntity(maxForce, maxSpeed, mass) {
    this.position = new Vector2d(400, 300);
    this.maxForce = maxForce;
    this.maxSpeed = maxSpeed;
    this.mass = mass;
    this.velocity = new Vector2d(0, 0);
    this.steeringBehaviours = new SteeringBehaviours(this);
    this.heading = new Vector2d(0, 15);
    this.headingPosition = this.position.clone();
    this.headingPosition.add(this.heading);

    this.updateVelocity = function(steeringForce) {
        this.velocity.add(steeringForce);
        if (maxSpeed > 0) {
            this.velocity.truncate(this.maxSpeed);
        }
    };

    this.updateHeading = function() {
        this.heading = this.velocity.clone();
        this.heading.normalize();
    };

    this.updatePosition = function() {
        this.position.add(this.velocity);
        if (this.position.x > 680) {
            this.position.x = 680;
        }
        if (this.position.x < 20) {
            this.position.x = 20;
        }
        if (this.position.y > 380) {
            this.position.y = 380;
        }
        if (this.position.y < 20) {
            this.position.y = 20;
        }
    };

    this.updateHeadingPosition = function() {
        this.headingPosition = this.position.clone();
        var headingClone = this.heading.clone();
        headingClone.multiply(15);
        this.headingPosition.add(headingClone);
    };
}

module.exports = MovingEntity;
