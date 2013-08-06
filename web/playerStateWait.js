var Vector2d = require('./vector2d');

function PlayerStateWait() {
    this.name = 'Wait';

    this.enter = function(player) {
    };

    this.exit = function(player) {
    };

    this.execute = function(player) {
        var PlayerStateChase = require('./playerStateChase');

        if (!player.steeringBehaviours.isAtCurrentTarget()) {
            // player has been moved away from target - move to it again
            player.steeringBehaviours.arrive = true;

            return;
        } else {
            player.steeringBehaviours.arrive = false;

            player.velocity = new Vector2d(0, 0);

            player.trackBall();

            if (player.team.inControl()) {
                if (!player.isControllingPlayer()) {
                    if (player.isAheadOfAttacker()) {
        //                player.team.requestPass(player); todo
                    }
                }
            }

            if (player.team.pitch.gameOn) {
                if (player.isClosestTeamMemberToBall() &&
                    player.team.receiver == null &&
                    !player.team.pitch.goalkeeperHasBall) {
                    player.stateMachine.changeState(new PlayerStateChase());
                }
            }
        }
    };
}

module.exports = PlayerStateWait;
