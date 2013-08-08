var PlayerStateGlobal = require('./playerStateGlobal');
var PlayerStateWait = require('./playerStateWait');

function PlayerStateMachine(player) {
    this.entity = player;
    this.currentState = new PlayerStateWait();
    this.globalState = new PlayerStateGlobal();

    this.update = function() {
        if (this.globalState) {
            this.globalState.execute(this.entity);
        }
        if (this.currentState) {
            this.currentState.execute(this.entity);
        }
    };

    this.changeState = function(newState) {
        console.log('player ' + this.entity.id + ' of team ' + this.entity.team.id + ' changed state to ' + newState.name);
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

module.exports = PlayerStateMachine;
