var PlayerStateWait = require('./playerStateWait');

function PlayerStateReturnToHomeRegion() {
    this.name = 'ReturnToHomeRegion';

    this.enter = function(player) {
        player.steeringBehaviours.arrive = true;
    };

    this.exit = function(player) {
        player.steeringBehaviours.arrive = false;
    };

    this.execute = function(player) {
        player.homeRegion.center.log();
        player.steeringBehaviours.currentTarget = player.homeRegion.center;

        if (player.inHomeRegion()) {
            player.stateMachine.changeState(new PlayerStateWait());
        }
    };
}

module.exports = PlayerStateReturnToHomeRegion;
