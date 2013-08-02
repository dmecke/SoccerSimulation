function GoalkeeperStateTendGoal() {
    this.name = 'TendGoal';

    this.enter = function(goalkeeper) {
        goalkeeper.steeringBehaviours.interpose = true;
        goalkeeper.steeringBehaviours.currentTarget = goalkeeper.getRearInterposeTarget();
    };

    this.exit = function(goalkeeper) {
        goalkeeper.steeringBehaviours.interpose = false;
    };

    this.execute = function(goalkeeper) {
        goalkeeper.steeringBehaviours.currentTarget = goalkeeper.getRearInterposeTarget();

        if (goalkeeper.ballWithinReceivingRange()) {
//            @todo
//            goalkeeper.ball.trap();
//            goalkeeper.pitch.goalkeeperHasBall = true;
//            goalkeeper.stateMachine.changeState(new GoalkeeperStatePutBallBackInPlay());

            return;
        }

        if (goalkeeper.ballWithinRangeForIntercept()) {
//            @todo
//            goalkeeper.stateMachine.changeState(new GoalkeeperStateInterceptBall());
        }

        if (goalkeeper.tooFarFromGoalMouth() && goalkeeper.team.inControl()) {
            var GoalkeeperStateReturnHome = require('./goalkeeperStateReturnHome');
            goalkeeper.stateMachine.changeState(new GoalkeeperStateReturnHome());

            return;
        }
    };
}

module.exports = GoalkeeperStateTendGoal;
