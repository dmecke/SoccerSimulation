var MovingEntity = require('./movingEntity');
var Vector2d = require('./vector2d');
var Param = require('./param');
var util = require('util');
var MessageDispatcher = require('./messageDispatcher');
var MessageTypes = require('./messageTypes');

function BasePlayer(id, team, role) {
    MovingEntity.call(this, new Param().PlayerMaxForce, new Param().PlayerMaxSpeedWithoutBall, new Param().PlayerMass);

    this.id = id;
    this.color = team.color;
    this.team = team;
    this.position = new Vector2d((this.team.pitch.playingArea.right - this.team.pitch.playingArea.left) / 2, this.team.pitch.playingArea.bottom);
    this.homeRegion = null;
    this.defaultHomeRegion = null;
    this.role = role;

    this.inHomeRegion = function() {
        return this.homeRegion.isInside(this.position);
    };

    this.handleMessage = function(telegram) {
        this.stateMachine.handleMessage(telegram);
    };

    /**
     * true if the player is located in the designated 'hot region' -- the area close to the opponent's goal
     */
    this.inHotRegion = function() {
        return Math.abs(this.position.y - this.team.getGoal().center.y) < this.team.pitch.playingArea.length / 3;
    };

    this.equals = function(player) {
        return this.id == player.id && this.team.equals(player.team);
    };

    this.toJSON = function() {
        return {
            'id': this.id,
            'color': this.color,
            'position': this.position,
            'heading': this.heading,
            'currentTarget': this.steeringBehaviours.currentTarget,
            'state': this.stateMachine.currentState.name,
            'homeRegion': this.homeRegion
        }
    };

    this.trackBall = function() {
        var toTarget = this.team.pitch.ball.position.clone();
        toTarget.subtract(this.position);
        toTarget.normalize();
        this.heading = toTarget;
    };

    this.ballWithinReceivingRange = function() {
        return this.position.distanceSq(this.team.pitch.ball.position) < new Param().BallWithinReceivingRange * new Param().BallWithinReceivingRange;
    };

    this.isControllingPlayer = function() {
        return this.team.controllingPlayer && this.team.controllingPlayer.equals(this);
    };

    this.isClosestTeamMemberToBall = function() {
        return this.team.playerClosestToBall.equals(this);
    };

    this.isClosestPlayerOnPitchToBall = function() {
        return this.isClosestTeamMemberToBall() && this.position.distanceSq(this.team.pitch.ball) < this.team.getOpponent().playerClosestToBall.position.distanceSq(this.team.pitch.ball);
    };

    this.atTarget = function() {
        return this.position.distanceSq(this.steeringBehaviours.currentTarget) < new Param().PlayerInTargetRange * new Param().PlayerInTargetRange;
    };

    this.positionInFrontOfPlayer = function(position) {
        var localPosition = position.clone();
        var toSubject = localPosition.subtract(this.position);

        return toSubject.dot(this.heading) > 0;
    };

    /**
     * determines the player who is closest to the SupportSpot and messages him
     * to tell him to change state to SupportAttacker
     */
    this.findSupport = function() {
        //if there is no support we need to find a suitable player.
        if (this.team.supportingPlayer == null) {
            var bestSupportPlayer = this.team.determineBestSupportingAttacker();
            this.team.supportingPlayer = bestSupportPlayer;
            new MessageDispatcher().dispatchMessage(0, this, this.team.supportingPlayer, new MessageTypes().supportAttacker, null);
        }

        var bestSupportPlayer = this.team.determineBestSupportingAttacker();

        //if the best player available to support the attacker changes, update
        //the pointers and send messages to the relevant players to update their
        //states
        if (bestSupportPlayer != null && bestSupportPlayer != this.team.supportingPlayer) {

            if (this.team.supportingPlayer != null) {
                new MessageDispatcher().dispatchMessage(0, this, this.team.supportingPlayer, new MessageTypes().goHome, null);
            }
            this.team.supportingPlayer = bestSupportPlayer;
            new MessageDispatcher().dispatchMessage(0, this, this.team.supportingPlayer, new MessageTypes().supportAttacker, null);
        }
    };
}
util.inherits(BasePlayer, MovingEntity);

module.exports = BasePlayer;
