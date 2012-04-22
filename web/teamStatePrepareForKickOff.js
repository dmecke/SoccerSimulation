function TeamStatePrepareForKickOff() {
    this.name = 'PrepareForKickOff';

    this.enter = function(team) {
        var homeRegions = [];
        if (team.id == 1) {
            homeRegions = [16, 9, 11, 12, 14];
        } else {
            homeRegions = [1, 6, 8, 3, 5];
        }
        team.changePlayerHomeRegions(homeRegions);

        team.controllingPlayer = null;
        team.supportingPlayer = null;
        team.receivingPlayer = null;
        team.playerClosestToBall = null;

        team.returnAllFieldPlayersToHome();
    };

    this.exit = function(team) {
    };

    this.execute = function(team) {
        if (team.allPlayersAtHome() && team.opponent.allPlayersAtHome()) {
            team.stateMachine.changeState(new TeamStateDefending());
        }
    };
}

module.exports = TeamStatePrepareForKickOff;
