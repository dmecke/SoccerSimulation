function SteeringBehaviours(player) {
    this.player = player;

    this.seekSteeringForce = function(target) {
        if (this.player.position.distanceSq(target) < 100) {
            target.x = Math.random() * 600;
            target.y = Math.random() * 400;
        }

        steeringForce = target.clone();
        steeringForce.subtract(this.player.position);
        steeringForce.normalize();
        steeringForce.multiply(this.player.maxSpeed);
        steeringForce.subtract(this.player.velocity);

        return steeringForce;
    };

    this.toJSON = function() {
        return {};
    }
}

module.exports = SteeringBehaviours;
