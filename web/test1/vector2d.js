function Vector2d() {
    this.x = 0;
    this.y = 0;

    this.clone = function() {
        vector2d = new Vector2d();
        vector2d.x = this.x;
        vector2d.y = this.y;

        return vector2d;
    };

    this.coords = function() {
        return '[' + this.x + ', ' + this.y + ']';
    };

    this.zero = function() {
        this.x = 0;
        this.y = 0;
    };

    this.random = function(xMax, yMax) {
        this.x = Math.random() * xMax;
        this.y = Math.random() * yMax;
    };

    this.isZero = function() {
        return this.x * this.x + this.y * this.y < 0.00000001;
    };

    this.length = function() {
        return Math.sqrt(this.lengthSq());
    };

    this.lengthSq = function() {
        return this.x * this.x + this.y * this.y;
    };

    this.normalize = function() {
        var length = this.length();
        this.x = this.x / length;
        this.y = this.y / length;

        return this;
    };

    this.dot = function(vector2d) {

        return this.x * vector2d.x + this.y * vector2d.y;
    };

    this.sign = function(vector2d) {
        throw 'Vector2d.sign() is not yet implemented';
    };

    this.perp = function() {
        var vector2d = new Vector2d();
        vector2d.x = this.y * -1;
        vector2d.y = this.x;

        return vector2d;
    };

    this.truncate = function(max) {
        if (this.length() > max) {
            this.normalize();
            this.multiply(max);
        }

        return this;
    };

    this.distance = function(vector2d) {
        return Math.sqrt(this.distanceSq(vector2d));
    };

    this.distanceSq = function(vector2d) {
        var xSeparation = this.x - vector2d.x;
        var ySeparation = this.y - vector2d.y;

        return xSeparation * xSeparation + ySeparation * ySeparation;
    };

    this.getReverse = function() {
        throw 'Vector2d.getReverse() is not yet implemented';
    };

    this.add = function(vector2d) {
        this.x = this.x + vector2d.x;
        this.y = this.y + vector2d.y;

        return this;
    };

    this.subtract = function(vector2d) {
        this.x = this.x - vector2d.x;
        this.y = this.y - vector2d.y;

        return this;
    };

    this.multiply = function(factor) {
        this.x = this.x * factor;
        this.y = this.y * factor;

        return this;
    };

    this.divide = function(divider) {
        this.x = this.x / divider;
        this.y = this.y / divider;

        return this;
    };

    this.equals = function(vector2d) {
        return this.x == vector2d.x && this.y == vector2d.y;
    };

    this.notEquals = function(vector2d) {
        return !this.equals(vector2d);
    };

    this.createNormalized = function() {
        var vector2d = new Vector2d();
        vector2d.x = this.x;
        vector2d.y = this.y;
        vector2d.normalize();

        return vector2d;
    };

    /**
     * @todo does not work correctly
     */
    this.angle = function() {
        var vector2d = new Vector2d();
        vector2d.x = this.length();
        vector2d.y = 0;

        var angle = this.dot(vector2d);
        console.log(this.coords());
        console.log(angle);
        return angle;
    }
}

module.exports = Vector2d;
