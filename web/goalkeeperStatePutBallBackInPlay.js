var Param = require('./param');
var Vector2d = require('./vector2d');
var MessageDispatcher = require('./messageDispatcher');
var MessageTypes = require('./messageTypes');

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
        var receiver = null;
        var ballTarget = new Vector2d(0, 0);
        //test if there are players further forward on the field we might
        //be able to pass to. If so, make a pass.
        if (goalkeeper.team.findPass(goalkeeper, receiver, ballTarget, new Param().MaxPassingForce, new Param().GoalkeeperMinPassDist)) {
            var localBallTarget = ballTarget.clone();
            goalkeeper.team.pitch.ball.kick(localBallTarget.subtract(goalkeeper.team.pitch.ball.position).normalize(), new Param().MaxPassingForce);

            goalkeeper.team.pitch.goalkeeperHasBall = false;

            var dispatcher = new MessageDispatcher();
            var messageTypes = new MessageTypes();
            dispatcher.dispatchMessage(0, goalkeeper, receiver, messageTypes.receiveBall, ballTarget);

            var GoalkeeperStateTendGoal = require('./goalkeeperStateTendGoal');
            goalkeeper.stateMachine.changeState(new GoalkeeperStateTendGoal());

            return;
        }

        goalkeeper.velocity = new Vector2d(0, 0);
    };

    this.onMessage = function() {
        return false;
    };
}

module.exports = GoalkeeperStatePutBallBackInPlay;
