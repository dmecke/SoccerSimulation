function Vector2d(x, y) {
    this.x = x;
    this.y = y;

    this.clone = function() {
        return new Vector2d(this.x, this.y);
    };

    this.add = function(vector2d) {
        this.x = this.x + vector2d.x;
        this.y = this.y + vector2d.y;
    };

    this.subtract = function(vector2d) {
        this.x = this.x - vector2d.x;
        this.y = this.y - vector2d.y;
    };

    this.multiply = function(divider) {
        this.x = this.x * divider;
        this.y = this.y * divider;
    };

    this.divide = function(factor) {
        this.x = this.x / factor;
        this.y = this.y / factor;
    };

    this.length = function() {
        return Math.sqrt(this.lengthSq());
    };

    this.lengthSq = function() {
        return this.x * this.x + this.y * this.y;
    };

    this.distance = function(vector2d) {
        return Math.sqrt(this.distanceSq(vector2d));
    };

    this.distanceSq = function(vector2d) {
        var xSeparation = this.x - vector2d.x;
        var ySeparation = this.y - vector2d.y;

        return xSeparation * xSeparation + ySeparation * ySeparation;
    };

    this.normalize = function() {
        var length = this.length();
        this.x = this.x / length;
        this.y = this.y / length;
    };

    this.truncate = function(max) {
        if (this.length() > max) {
            this.normalize();
            this.multiply(max);
        }
    };

    this.log = function() {
        console.log(this.x + '|' + this.y + ' (' + this.length() + ')');
    };
}

module.exports = Vector2d;
