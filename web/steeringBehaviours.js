function SteeringBehaviours(player) {
    this.player = player;

    this.seekSteeringForce = function(target) {
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
