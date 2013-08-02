function GoalkeeperStateReturnHome() {
    this.name = 'ReturnHome';

    this.enter = function(goalkeeper) {
        goalkeeper.steeringBehaviours.arrive = true;
    };

    this.exit = function(goalkeeper) {
        goalkeeper.steeringBehaviours.arrive = false;
    };

    this.execute = function(goalkeeper) {
        goalkeeper.steeringBehaviours.currentTarget = goalkeeper.homeRegion.center;

        if (goalkeeper.team.pitch.gameOn && (goalkeeper.inHomeRegion() || !goalkeeper.team.inControl())) {
            var GoalkeeperStateTendGoal = require('./goalkeeperStateTendGoal');
            goalkeeper.stateMachine.changeState(new GoalkeeperStateTendGoal());
        }
    };
}

module.exports = GoalkeeperStateReturnHome;
