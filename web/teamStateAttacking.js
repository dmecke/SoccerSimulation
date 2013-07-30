var TeamStateDefending = require('./teamStateDefending');

function TeamStateAttacking() {
    this.name = 'Attacking';

    this.enter = function(team) {
        var homeRegions = [];
        if (team.id == 1) {
            homeRegions = [16, 3, 5, 9, 13];
        } else {
            homeRegions = [1, 12, 14, 6, 4];
        }
        team.changePlayerHomeRegions(homeRegions);

        // if a player is in state "Wait" or "ReturnToHomeRegion, its
        // steering target must be updated to its new home region
//        team.updateTargetsOfWaitingPlayers(); todo
    };

    this.exit = function(team) {
    };

    this.execute = function(team) {
        if (!team.inControl) {
            team.changeState(new TeamStateDefending());

            return;
        }

//        team.determineBestSupportingPosition();
    };
}

module.exports = TeamStateAttacking;
