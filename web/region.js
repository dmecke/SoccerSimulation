var Vector2d = require('./vector2d');

function Region(left, top, right, bottom) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.center = new Vector2d((left + right) * 0.5, (top + bottom) * 0.5);
    this.width = Math.abs(right - left);
    this.height = Math.abs(bottom - top);

    this.toJSON = function() {
        return {
            'left': this.left,
            'right': this.right,
            'top': this.top,
            'width': this.width,
            'height': this.height,
            'center': this.center
        }
    };
}

module.exports = Region;
