var MessageTypes = require('./messageTypes');

function GoalkeeperStateGlobal() {
    this.name = 'Global';

    this.enter = function(goalkeeper) {
    };

    this.exit = function(goalkeeper) {
    };

    this.execute = function(goalkeeper) {
    };

    this.onMessage = function(goalkeeper, telegram) {
        if (telegram.message == new MessageTypes().goHome) {
            goalkeeper.homeRegion = goalkeeper.defaultHomeRegion;
            var GoalkeeperStateReturnHome = require('./goalkeeperStateReturnHome');
            goalkeeper.stateMachine.changeState(new GoalkeeperStateReturnHome());
        } else if (telegram.message == new MessageTypes().receiveBall) {
            var GoalkeeperStateInterceptBall = require('./goalkeeperStateInterceptBall');
            goalkeeper.stateMachine.changeState(new GoalkeeperStateInterceptBall());
        }

        return false;
    };
}

module.exports = GoalkeeperStateGlobal;
