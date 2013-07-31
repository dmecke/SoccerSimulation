function Goal(leftPost, rightPost, facing) {

    this.leftPost = leftPost;
    this.rightPost = rightPost;

    this.center = leftPost.clone();
    this.center.add(rightPost);
    this.center.divide(2);

    this.facing = facing;

    this.goalsScored = 0;

    this.scored = function(ball) {
        if ((this.facing.x > 0 && ball.position.x < this.center.x) || (this.facing.x < 0 && ball.position.x > this.center.x)) {
            this.goalsScored++;

            return true;
        }

        return false;
    };

    this.toJSON = function() {
        return {
            'leftPost': this.leftPost,
            'rightPost': this.rightPost,
            'goalsScored': this.goalsScored
        }
    };
}

module.exports = Goal;
