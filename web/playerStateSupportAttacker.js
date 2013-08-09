var Param = require('./param');
var Vector2d = require('./vector2d');

function PlayerStateSupportAttacker() {
    this.name = 'SupportAttacker';

    this.enter = function(player) {
        player.steeringBehaviours.arrive = true;
        player.steeringBehaviours.currentTarget = player.team.getSupportSpot();
    };

    this.exit = function(player) {
        player.team.supportingPlayer = null;
        player.steeringBehaviours.arrive = false;
    };

    this.execute = function(player) {
        //if his team loses control go back home
        if (!player.team.inControl()) {
            var PlayerStateReturnToHomeRegion = require('./playerStateReturnToHomeRegion');
            player.stateMachine.changeState(new PlayerStateReturnToHomeRegion());
            return;
        }

        //if the best supporting spot changes, change the steering target
        if (player.team.getSupportSpot() != player.steeringBehaviours.currentTarget) {
            player.steeringBehaviours.currentTarget = player.team.getSupportSpot();

            player.steeringBehaviours.arrive = true;
        }

        //if this player has a shot at the goal AND the attacker can pass
        //the ball to him the attacker should pass the ball to this player
        if (player.team.canShoot(player.position, new Param().MaxShootingForce)) {
            player.team.requestPass(player);
        }


        //if this player is located at the support spot and his team still have
        //possession, he should remain still and turn to face the ball
        if (player.atTarget()) {
            player.steeringBehaviours.arrive = false;

            //the player should keep his eyes on the ball!
            player.trackBall();

            player.velocity = new Vector2d(0, 0);

            //if not threatened by another player request a pass
            if (!player.isThreatened()) {
                player.team.requestPass(player);
            }
        }
    };

    this.onMessage = function() {
        return false;
    };
}

module.exports = PlayerStateSupportAttacker;
