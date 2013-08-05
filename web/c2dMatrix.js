function C2dMatrix() {
    this._11 = 0;
    this._12 = 0;
    this._21 = 0;
    this._22 = 0;
    this._31 = 0;
    this._32 = 0;

    this.transformVector2Ds = function(point) {
        var tempX = (this._11 * point.x) + (this._21 * point.y) + (this._31);
        var tempY = (this._12 * point.x) + (this._22 * point.y) + (this._32);
        point.x = tempX;
        point.y = tempY;
    }
}

module.exports = C2dMatrix;
