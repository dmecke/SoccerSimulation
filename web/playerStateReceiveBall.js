var Param = require('./param');
var Vector2d = require('./vector2d');

function PlayerStateReceiveBall() {
    this.name = 'ReceiveBall';

    this.enter = function(player) {
        //let the team know this player is receiving the ball
        player.team.receivingPlayer = player;

        //this player is also now the controlling player
        player.team.controllingPlayer = player;

        //there are two types of receive behavior. One uses arrive to direct
        //the receiver to the position sent by the passer in its telegram. The
        //other uses the pursuit behavior to pursue the ball.
        //This statement selects between them dependent on the probability
        //ChanceOfUsingArriveTypeReceiveBehavior, whether or not an opposing
        //player is close to the receiving player, and whether or not the receiving
        //player is in the opponents 'hot region' (the third of the pitch closest
        //to the opponent's goal
        var passThreatRadius = 70.0;
        if ((player.inHotRegion() || Math.random() < new Param().ChanceOfUsingArriveTypeReceiveBehavior) && !player.team.isOpponentWithinRadius(player.position, passThreatRadius)) {
            player.steeringBehaviours.arrive = true;
            console.log('player ' + player.id + ' of team ' + player.team.name + ' enters receive state (using arrive)');
        } else {
            player.steeringBehaviours.pursuit = true;
            console.log('player ' + player.id + ' of team ' + player.team.name + ' enters receive state (using pursuit)');
        }
    };

    this.exit = function(player) {
        player.steeringBehaviours.arrive = false;
        player.steeringBehaviours.pursuit = false;
        player.team.receivingPlayer = null;
    };

    this.execute = function(player) {
        //if the ball comes close enough to the player or if his team lose control
        //he should change state to chase the ball
        if (player.ballWithinReceivingRange() || !player.team.inControl()) {
            var PlayerStateChase = require('./playerStateChase');
            player.stateMachine.changeState(new PlayerStateChase());

            return;
        }

        if (player.steeringBehaviours.pursuit) {
            player.steeringBehaviours.currentTarget = player.team.pitch.ball.position;
        }

        //if the player has 'arrived' at the steering target he should wait and
        //turn to face the ball
        if (player.atTarget()) {
            player.steeringBehaviours.arrive = false;
            player.steeringBehaviours.pursuit = false;
            player.trackBall();
            player.velocity = new Vector2d(0, 0);
        }
    };

    this.onMessage = function() {
        return false;
    };
}

module.exports = PlayerStateReceiveBall;
