function PlayerStateReturnToHomeRegion() {
    this.name = 'ReturnToHomeRegion';

    this.enter = function(player) {
        player.steeringBehaviours.arrive = true;
    };

    this.exit = function(player) {
        player.steeringBehaviours.arrive = false;
    };

    this.execute = function(player) {
        var PlayerStateWait = require('./playerStateWait');
        player.steeringBehaviours.currentTarget = player.homeRegion.center;

        if (player.inHomeRegion()) {
            player.stateMachine.changeState(new PlayerStateWait());
        }
    };

    this.onMessage = function() {
        return false;
    };
}

module.exports = PlayerStateReturnToHomeRegion;
