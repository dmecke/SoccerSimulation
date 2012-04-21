var jquery = require('jquery');
var Player = require('./player');

function Team(id, pitch, color) {
    this.id = id;
    this.color = color;
    this.pitch = pitch;
    this.players = [];

    var player1 = new Player(1, this);
    player1.color = this.color;
    this.players.push(player1);

    this.update = function() {
        jquery.each(this.players, function(index, player) {
            player.update();
        });
    };

    this.equals = function(team) {
        return this.id == team.id;
    };

    this.toJSON = function() {
        return {
            'players' : this.players
        }
    };
}

module.exports = Team;
