var jquery = require('jquery');

function World() {
    this.players = [];

    this.update = function() {
        jquery.each(this.players, function(index, player) {
            player.update();
        });
    }
}

module.exports = World;
