var MovingEntity = require('./movingEntity');
var Vector2d = require('./vector2d');
var Param = require('./param');
var util = require('util');

function BasePlayer(id, team) {
    MovingEntity.call(this, new Param().PlayerMaxForce, new Param().PlayerMaxSpeedWithoutBall, new Param().PlayerMass);

    this.id = id;
    this.color = team.color;
    this.team = team;
    this.position = new Vector2d((this.team.pitch.playingArea.right - this.team.pitch.playingArea.left) / 2, this.team.pitch.playingArea.bottom);
    this.homeRegion = null;

    this.inHomeRegion = function() {
        return this.homeRegion.isInside(this.position);
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
    }
}
util.inherits(BasePlayer, MovingEntity);

module.exports = BasePlayer;
