function GoalkeeperStateInterceptBall() {
    this.name = 'InterceptBall';

    this.enter = function(goalkeeper) {
        goalkeeper.steeringBehaviours.pursuit = true;
    };

    this.exit = function(goalkeeper) {
        goalkeeper.steeringBehaviours.pursuit = false;
    };

    this.execute = function(goalkeeper) {
        if (goalkeeper.tooFarFromGoalMouth() && !goalkeeper.isClosestPlayerOnPitchToBall()) {
            var GoalkeeperStateReturnHome = require('./goalkeeperStateReturnHome');
            goalkeeper.stateMachine.changeState(new GoalkeeperStateReturnHome());
        }

        if (goalkeeper.ballWithinReceivingRange()) {
            goalkeeper.team.pitch.ball.trap();
            goalkeeper.team.pitch.goalkeeperHasBall = true;
            var GoalkeeperStatePutBallBackInPlay = require('./goalkeeperStatePutBallBackInPlay');
            goalkeeper.stateMachine.changeState(new GoalkeeperStatePutBallBackInPlay());

            return;
        }
    };
}

module.exports = GoalkeeperStateInterceptBall;
