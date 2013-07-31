var TeamStateAttacking = require('./teamStateAttacking');

function TeamStateDefending() {
    this.name = 'Defending';

    this.enter = function(team) {
        var homeRegions = [];
        if (team.id == 1) {
            homeRegions = [1, 6, 8, 3, 5];
        } else {
            homeRegions = [16, 9, 11, 12, 14];
        }
        team.changePlayerHomeRegions(homeRegions);

        // if a player is in state "Wait" or "ReturnToHomeRegion, its
        // steering target must be updated to its new home region
//        team.updateTargetsOfWaitingPlayers(); todo
    };

    this.exit = function(team) {
    };

    this.execute = function(team) {
        if (team.inControl()) {
            team.stateMachine.changeState(new TeamStateAttacking());
        }
    };
}

module.exports = TeamStateDefending;
