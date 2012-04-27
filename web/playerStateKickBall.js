var Vector2d = require('./vector2d');

function PlayerStateKickBall() {
    this.name = 'KickBall';

    this.enter = function(player) {
        var PlayerStateChase = require('./playerStateChase');
        player.team.controllingPlayer = player;

//        if (!player.isReadyForNextKick()) { todo
//            player.stateMachine.changeState(new PlayerStateChase());
//        }
    };

    this.exit = function(player) {
    };

    this.execute = function(player) {
        var PlayerStateChase = require('./playerStateChase');
        var PlayerStateWait = require('./playerStateWait');

        // check whether the ball is in front or behind the player
        var toBall = player.team.pitch.ball.position.clone();
        toBall.subtract(player.position);
        toBall.normalize();
        var dot = player.heading.dot(toBall);

        if (player.team.receivingPlayer != null || player.team.pitch.goalkeeperHasBall() || dot < 0) {
            player.stateMachine.changeState(new PlayerStateChase());
        }

        var shootingPower = dot * 5; // direction of the player to the ball * maxShootingForce

        var shootingBallTarget = player.team.canShoot(player.team.pitch.ball.position, shootingPower, shootingBallTarget);
        if (shootingBallTarget != false || Math.random() < 0.5) { // add a chance for a potshot
//            shootingBallTarget = this.addNoiseToKick(player.team.pitch.ball.position, shootingBallTarget); todo

            var shootingKickDirection = shootingBallTarget.clone();
            shootingKickDirection.subtract(player.team.pitch.ball.position);

            player.team.pitch.ball.kick(shootingKickDirection, shootingPower);

            player.stateMachine.changeState(new PlayerStateWait());

//            player.findSupport(); todo

            return;
        }

        var receiver = null;
        var passingPower = dot * 5; // direction of the player to the ball * maxPassingForce

        var passingBallTarget = new Vector2d(0, 0);
        if (player.isThreatened() && player.team.canPass(player, receiver, passingBallTarget, passingPower, 100)) { // last parameter is the minimum pass distance
//            passingBallTarget = this.addNoiseToKick(player.team.pitch.ball.position, passingBallTarget); todo

            var passingKickDirection = passingBallTarget.clone();
            passingKickDirection.subtract(player.team.pitch.ball.position);

            player.team.pitch.ball.kick(kickDirection, power);

            // send message to receiver

            player.changeState(new PlayerStateWait());

//            player.findSupport(); todo

            return;
        }

//        player.findSupport(); todo

//        player.changeState(new PlayerStateDribble()); todo
    };
}

module.exports = PlayerStateKickBall;
