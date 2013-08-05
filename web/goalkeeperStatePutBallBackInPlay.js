var Param = require('./param');

function GoalkeeperStatePutBallBackInPlay() {
    this.name = 'PutBallBackInPlay';

    this.enter = function(goalkeeper) {
        goalkeeper.team.controllingPlayer = goalkeeper;
        goalkeeper.team.getOpponent().controllingPlayer = null;

        goalkeeper.team.getOpponent().returnAllFieldPlayersToHome();
        goalkeeper.team.returnAllFieldPlayersToHome();
    };

    this.exit = function(goalkeeper) {
    };

    this.execute = function(goalkeeper) {
        // @todo (passing not yet implemented)
        var target = goalkeeper.team.pitch.playingArea.center.clone();
        target.subtract(goalkeeper.team.pitch.ball.position);
        goalkeeper.team.pitch.ball.kick(target, new Param().MaxShootingForce); // @todo remove this, its a temporary replacement for the missing passing above
        goalkeeper.team.pitch.goalkeeperHasBall = false;
        var GoalkeeperStateTendGoal = require('./goalkeeperStateTendGoal');
        goalkeeper.stateMachine.changeState(new GoalkeeperStateTendGoal());
    };
}

module.exports = GoalkeeperStatePutBallBackInPlay;
