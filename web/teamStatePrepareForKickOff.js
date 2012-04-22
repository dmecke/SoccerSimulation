function TeamStatePrepareForKickOff() {
    this.name = 'PrepareForKickOff';

    this.enter = function(team) {
//        team.controllingPlayer = null; todo
//        team.supportingPlayer = null; todo
        team.receivingPlayer = null;
        team.playerClosestToBall = null;

//        team.returnAllFieldPlayersToHome(); todo
    };

    this.exit = function(team) {
    };

    this.execute = function(team) {
//        if (team.allPlayersAtHome() && team.opponent.allPlayersAtHome()) { todo
//            team.stateMachine.changeState(new TeamStateDefending());
//        }
    };
}

module.exports = TeamStatePrepareForKickOff;
