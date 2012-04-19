var PlayerStateGlobal = require('./playerStateGlobal');
var PlayerStateWait = require('./playerStateWait');

function PlayerStateMachine(player) {
    this.player = player;
    this.currentState = new PlayerStateWait();
    this.globalState = new PlayerStateGlobal();

    this.update = function() {
        if (this.globalState) {
            this.globalState.execute(this.player);
        }
        if (this.currentState) {
            this.currentState.execute(this.player);
        }
    };

    this.changeState = function(newState) {
        this.currentState.exit(this.player);
        this.currentState = newState;
        this.currentState.enter(this.player);
    };

    this.toJSON = function() {
        return {};
    }
}

module.exports = PlayerStateMachine;
