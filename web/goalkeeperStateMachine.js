var GoalkeeperStateGlobal = require('./goalkeeperStateGlobal');
var GoalkeeperStateTendGoal = require('./goalkeeperStateTendGoal');

function GoalkeeperStateMachine(goalkeeper) {
    this.entity = goalkeeper;
    this.currentState = new GoalkeeperStateTendGoal();
    this.globalState = new GoalkeeperStateGlobal();

    this.update = function() {
        if (this.globalState) {
            this.globalState.execute(this.entity);
        }
        if (this.currentState) {
            this.currentState.execute(this.entity);
        }
    };

    this.changeState = function(newState) {
        console.log('goalkeeper ' + this.entity.id + ' of team ' + this.entity.team.id + ' changed state to ' + newState.name);
        this.currentState.exit(this.entity);
        this.currentState = newState;
        this.currentState.enter(this.entity);
    };

    this.handleMessage = function(telegram) {
        if (this.currentState.onMessage(this.entity, telegram)) {
            return true;
        }

        if (this.globalState.onMessage(this.entity, telegram)) {
            return true;
        }

        return false;
    };

    this.toJSON = function() {
        return {};
    }
}

module.exports = GoalkeeperStateMachine;
