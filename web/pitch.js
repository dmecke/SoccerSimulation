var jquery = require('jquery');

function Pitch() {
    this.teams = [];
    this.gameOn = true;

    this.update = function() {
        jquery.each(this.teams, function(index, team) {
            team.update();
        });
    }
}

module.exports = Pitch;
