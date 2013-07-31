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

    this.updateVelocity = function(steeringForce) {
        this.velocity.add(steeringForce);
        if (maxSpeed > 0) {
            this.velocity.truncate(this.maxSpeed);
        }
    };

    this.updateHeading = function() {
        if (this.velocity.lengthSq() > 0) {
            this.heading = this.velocity.clone();
            this.heading.normalize();
        }
    };

    this.updatePosition = function() {
        this.position.add(this.velocity);
        if (this.position.x > 680) {
            this.position.x = 680 - (this.position.x - 680);
            this.velocity.x *= -1;
        }
        if (this.position.x < 20) {
            this.position.x = 20 + (20 - this.position.x);
            this.velocity.x *= -1;
        }
        if (this.position.y > 380) {
            this.position.y = 380 - (this.position.y - 380);
            this.velocity.y *= -1;
        }
        if (this.position.y < 20) {
            this.position.y = 20 + (20 - this.position.y);
            this.velocity.y *= -1;
        }
    };
}

module.exports = MovingEntity;
