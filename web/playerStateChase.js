
function PlayerStateChase() {
    this.name = 'Chase';

    this.enter = function(player) {
        player.steeringBehaviours.seek = true;
    };

    this.exit = function(player) {
        player.steeringBehaviours.seek = false;
    };

    this.execute = function(player) {
        var PlayerStateReturnToHomeRegion = require('./playerStateReturnToHomeRegion');
        // ball can be shooted - so do it
//        if (player.ballWithinKickingRange()) { todo
//            player.stateMachine.changeState(new PlayerStateKickBall()); todo
//            return;
//        }

        // player is closest to ball - so update position and keep chasing
        if (player.isClosestTeamMemberToBall()) {
            player.steeringBehaviours.currentTarget = player.team.pitch.ball.position;

            return;
        }

        // player is not the closest to ball - move back to home region
        player.stateMachine.changeState(new PlayerStateReturnToHomeRegion());
    };
}

module.exports = PlayerStateChase;
