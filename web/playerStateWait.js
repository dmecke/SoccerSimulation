var Vector2d = require('./vector2d');

function PlayerStateWait() {
    this.name = 'Wait';

    this.enter = function(player) {
    };

    this.exit = function(player) {
    };

    this.execute = function(player) {

        if (!player.steeringBehaviours.isAtCurrentTarget()) {
            // player has been moved away from target - move to it again
            player.steeringBehaviours.arrive = true;

            return;
        } else {
            player.steeringBehaviours.arrive = false;

            player.velocity = new Vector2d(0, 0);

//            player.trackBall(); //todo

//            if (player.team.inControl && todo
//                !player.isControllingPlayer && todo
//                player.isAheadOfAttacker) { todo
//                player.team.requestPass(player); todo
//            }

//            if (player.pitch.gameOn) { todo
//                if (player.isClosestTeamMemberToBall() && todo
//                    player.team.receiver == null && todo
//                    !player.pitch.goalkeeperHasBall()) { todo
//                    player.stateMachine.changeState(new PlayerStateChase(player));
//
//                    return;
//                }
//            }
        }
    };
}

module.exports = PlayerStateWait;
