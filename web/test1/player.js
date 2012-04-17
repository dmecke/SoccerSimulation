var MovingEntity = require('./movingEntity');
var SteeringBehaviours = require('./steeringBehaviours');
var Vector2d = require('./vector2d');

Player.prototype = new MovingEntity();
function Player(color) {
    MovingEntity.call(this);
    this.color = color;
    this.steeringBehaviours = new SteeringBehaviours(this);
    this.heading = new Vector2d();
}
Player.prototype.update = function() {
    var steeringForce = this.steeringBehaviours.calculate();
    var acceleration = steeringForce.divide(this.mass);
    this.velocity.add(acceleration);
    if (this.velocity > this.maxSpeed) {
        this.velocity = this.maxSpeed;
    }
    this.position.add(this.velocity);
    if (this.velocity.lengthSq() > 0.00000001) {
        this.heading = this.velocity.createNormalized();
        this.side = this.heading.perp();
    }
};

module.exports = Player;
