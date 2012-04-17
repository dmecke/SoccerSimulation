function SoccerPitch() {
    this.players = [];

    this.toJson = function() {
        var transferArray = [];
        for (i = 0; i < this.players.length; i++) {
            var obj = {};
            obj.color = this.players[i].color;
            obj.position = this.players[i].position;
            obj.angle = this.players[i].heading.angle();
            transferArray.push(obj);
        }

        return JSON.stringify(transferArray);
    }
}

module.exports = SoccerPitch;
