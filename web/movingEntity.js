var Vector2d = require('./vector2d');
var SteeringBehaviours = require('./steeringBehaviours');

function MovingEntity() {
    this.position = new Vector2d(600, 300);
    this.maxForce = 5;
    this.maxSpeed = 20;
    this.mass = 1;
    this.velocity = new Vector2d(0, 0);
    this.steeringBehaviours = new SteeringBehaviours(this);
    this.heading = new Vector2d(0, 15);
    this.headingPosition = this.position.clone();
    this.headingPosition.add(this.heading);

    this.updateVelocity = function(steeringForce) {
        this.velocity.add(steeringForce);
        this.velocity.truncate(this.maxSpeed);
    };

    this.updateHeading = function() {
        this.heading = this.velocity.clone();
        this.heading.normalize();
    };

    this.updatePosition = function() {
        this.position.add(this.velocity);
        if (this.position.x > 1190) {
            this.position.x = 1190;
        }
        if (this.position.x < 10) {
            this.position.x = 10;
        }
        if (this.position.y > 590) {
            this.position.y = 590;
        }
        if (this.position.y < 10) {
            this.position.y = 10;
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
