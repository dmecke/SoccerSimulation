var Ball = require('../ball');
var Vector2d = require('../vector2d');
module.exports = {
    setUp: function(callback) {
        callback();
    },
    tearDown: function(callback) {
        callback();
    },
    kick: function(test) {
        var ball = new Ball();
        ball.mass = 10;
        var direction = new Vector2d(10, 10);
        var force = 10;
        ball.kick(direction, force);

        var target = new Vector2d(1, 1);
        target.normalize();

        test.ok(ball.velocity.equals(target));
        test.done();
    }
};
