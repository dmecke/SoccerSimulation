var Param = require('./param');
var MessageDispatcher = require('./messageDispatcher');
var MessageTypes = require('./messageTypes');

function PlayerStateGlobal() {
    this.name = 'Global';

    this.enter = function(player) {
    };

    this.exit = function(player) {
    };

    this.execute = function(player) {
        if (player.ballWithinReceivingRange() && player.isControllingPlayer()) {
            player.maxSpeed = new Param().PlayerMaxSpeedWithBall;
        } else {
            player.maxSpeed = new Param().PlayerMaxSpeedWithoutBall;
        }
    };

    this.onMessage = function(player, telegram) {
        if (telegram.message == new MessageTypes().passToMe) {
            //get the position of the player requesting the pass
            var receiver = telegram.additionalInfo;

            //if the ball is not within kicking range or there is already a
            //receiving player, this player cannot pass the ball to the player
            //making the request.
            if (player.team.receivingPlayer != null || player.ballWithinKickingRange()) {
                console.log('cannot make requested pass');
                return true;
            }

            var receiverPosition = receiver.position.clone();
            player.team.pitch.ball.kick(receiverPosition.subtract(player.team.pitch.ball.position), new Param().MaxPassingForce);
            console.log('player ' + player.id + ' of team ' + player.team.name + ' passed ball to requesting player (' + receiver.id + ' of team ' + receiver.team.name + ')');

            var dispatcher = new MessageDispatcher();
            var messageTypes = new MessageTypes();
            dispatcher.dispatchMessage(0, player, receiver, messageTypes.receiveBall, receiver.position);

            //change state
            var PlayerStateWait = require('./playerStateWait');
            player.stateMachine.changeState(new PlayerStateWait());

//            player.findSupport(); @todo

            return true;
        } else if (telegram.message == new MessageTypes().receiveBall) {
            player.steeringBehaviours.currentTarget = telegram.additionalInfo;

            var PlayerStateReceiveBall = require('./playerStateReceiveBall');
            player.stateMachine.changeState(new PlayerStateReceiveBall());
        }
        return false;
        // @todo other message types
    };
}

module.exports = PlayerStateGlobal;
