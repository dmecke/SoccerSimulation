var Vector2d = require('../vector2d');
module.exports = {
    setUp: function(callback) {
        callback();
    },
    tearDown: function(callback) {
        callback();
    },
    add: function(test) {
        var vector = new Vector2d(10, 10);
        vector.add(new Vector2d(10, 10));

        test.equals(20, vector.x);
        test.equals(20, vector.y);
        test.done();
    }
};
