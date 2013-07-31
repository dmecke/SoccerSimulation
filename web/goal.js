function Goal(leftPost, rightPost, facing) {

    this.leftPost = leftPost;
    this.rightPost = rightPost;

    this.center = leftPost.clone();
    this.center.add(rightPost);
    this.center.divide(2);

    this.facing = facing;

    this.goalsScored = 0;

    this.toJSON = function() {
        return {
            'leftPost': this.leftPost,
            'rightPost': this.rightPost
        }
    };
}

module.exports = Goal;
