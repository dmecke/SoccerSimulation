var Vector2d = require('./vector2d');

function PlayerStateChase() {
    this.enter = function(player) {
        player.steeringBehaviours.seek = true;
    };

    this.exit = function(player) {
        player.steeringBehaviours.seek = false;
    };

    this.execute = function(player) {
    };
}

module.exports = PlayerStateChase;
