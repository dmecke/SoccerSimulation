function TeamStateAttacking() {
    this.name = 'Attacking';

    this.enter = function(team) {
        var homeRegions = [];
        if (team.id == 1) {
            homeRegions = [1, 12, 14, 6, 4];
        } else {
            homeRegions = [16, 3, 5, 9, 13];
        }
        team.changePlayerHomeRegions(homeRegions);

        // if a player is in state "Wait" or "ReturnToHomeRegion, its
        // steering target must be updated to its new home region
        team.updateTargetsOfWaitingPlayers();
    };

    this.exit = function(team) {
    };

    this.execute = function(team) {
        if (!team.inControl()) {
            var TeamStateDefending = require('./teamStateDefending');
            team.stateMachine.changeState(new TeamStateDefending());

            return;
        }

//        team.determineBestSupportingPosition();
    };
}

module.exports = TeamStateAttacking;
