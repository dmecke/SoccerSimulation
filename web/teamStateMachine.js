var TeamStatePrepareForKickOff = require('./teamStatePrepareForKickOff');

function TeamStateMachine(team) {
    this.entity = team;
    this.currentState = new TeamStatePrepareForKickOff();

    this.update = function() {
        if (this.currentState) {
            this.currentState.execute(this.entity);
        }
    };

    this.changeState = function(newState) {
        console.log('team ' + this.entity.id + ' changed state to ' + newState.name);
        this.currentState.exit(this.entity);
        this.currentState = newState;
        this.currentState.enter(this.entity);
    };

    this.toJSON = function() {
        return {};
    }
}

module.exports = TeamStateMachine;
