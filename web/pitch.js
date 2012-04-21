var jquery = require('jquery');

function Pitch() {
    this.players = [];

    this.update = function() {
        jquery.each(this.players, function(index, player) {
            player.update();
        });
    }
}

module.exports = Pitch;
