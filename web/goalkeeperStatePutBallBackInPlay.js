var Param = require('./param');

function GoalkeeperStatePutBallBackInPlay() {
    this.name = 'PutBallBackInPlay';

    this.enter = function(goalkeeper) {
        goalkeeper.team.controllingPlayer = goalkeeper;

        goalkeeper.team.getOpponent().returnAllFieldPlayersToHome();
        goalkeeper.team.returnAllFieldPlayersToHome();
    };

    this.exit = function(goalkeeper) {
    };

    this.execute = function(goalkeeper) {
        // @todo (passing not yet implemented)
        goalkeeper.team.pitch.ball.kick(goalkeeper.team.pitch.playingArea.center, new Param().MaxShootingForce); // @todo remove this, its a temporary replacement for the missing passing above
        goalkeeper.team.pitch.goalkeeperHasBall = false;
        var GoalkeeperStateTendGoal = require('./goalkeeperStateTendGoal');
        goalkeeper.stateMachine.changeState(new GoalkeeperStateTendGoal());
    };
}

module.exports = GoalkeeperStatePutBallBackInPlay;
