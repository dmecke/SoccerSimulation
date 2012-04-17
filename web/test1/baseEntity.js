var Vector2d = require('./vector2d');

function BaseEntity() {
    this.position = new Vector2d();
    this.position.x = Math.random() * 300;
    this.position.y = Math.random() * 200;
    this.angle = Math.PI / 2;
}

module.exports = BaseEntity;
