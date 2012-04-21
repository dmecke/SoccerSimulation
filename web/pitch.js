var jquery = require('jquery');

function Pitch() {
    this.teams = [];
    this.ball = null;
    this.gameOn = true;

    this.update = function() {
        this.ball.update();
        jquery.each(this.teams, function(index, team) {
            team.update();
        });
    }
}

module.exports = Pitch;
