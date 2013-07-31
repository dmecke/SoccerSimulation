var Param = require('./param');

function PlayerStateGlobal() {
    this.name = 'Global';

    this.enter = function(player) {
    };

    this.exit = function(player) {
    };

    this.execute = function(player) {
        if (player.ballWithinReceivingRange() && player.isControllingPlayer()) {
            player.maxSpeed = new Param().PlayerMaxSpeedWithBall;
        } else {
            player.maxSpeed = new Param().PlayerMaxSpeedWithoutBall;
        }
    };
}

module.exports = PlayerStateGlobal;
