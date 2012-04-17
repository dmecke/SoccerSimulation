var BaseEntity = require('./baseEntity');
var Vector2d = require('./vector2d');

MovingEntity.prototype = new BaseEntity();
function MovingEntity() {
    BaseEntity.call(this);
    this.velocity = new Vector2d();
    this.side = new Vector2d();
    this.mass = 10;
    this.maxSpeed = 10;
    this.maxForce = 10;
    this.maxTurnRate = 10;
}

module.exports = MovingEntity;
