var Helper = require('./helper');

function PlayerStateDribble() {
    this.name = 'Dribble';

    this.enter = function(player) {
        player.team.controllingPlayer = player;
        player.team.getOpponent().controllingPlayer = null;
    };

    this.exit = function() {
    };

    this.execute = function(player) {
        var PlayerStateChase = require('./playerStateChase');

        var dot = player.team.getHomeGoal().facing.dot(player.heading);

        if (dot < 0) { // ball is between player and home goal
            var direction = player.heading;
            var angle = Math.PI / 4 * -1 * player.team.getHomeGoal().facing.sign(player.heading);

            var helper = new Helper();
            helper.vec2dRotateAroundOrigin(direction, angle);

            var kickingForce = 8;

            player.team.pitch.ball.kick(direction, kickingForce)
        } else { // ball is between player and goal

        }

        player.stateMachine.changeState(new PlayerStateChase());
    };

    this.onMessage = function() {
        return false;
    };
}

module.exports = PlayerStateDribble;
