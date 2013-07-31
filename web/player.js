var PlayerStateMachine = require('./playerStateMachine');
var MovingEntity = require('./movingEntity');
var Vector2d = require('./vector2d');
var Param = require('./param');
var util = require('util');

function Player(id, team) {
    MovingEntity.call(this, new Param().PlayerMaxForce, new Param().PlayerMaxSpeedWithoutBall, new Param().PlayerMass);

    this.id = id;
    this.color = team.color;
    this.team = team;
    this.neighbours = [];
    this.stateMachine = new PlayerStateMachine(this);
    this.homeRegion = null;
    this.position = new Vector2d((this.team.pitch.playingArea.right - this.team.pitch.playingArea.left) / 2, this.team.pitch.playingArea.bottom);

    this.update = function() {
        this.tagNeighbours();

        this.stateMachine.update();
        this.steeringBehaviours.update();
    };

    this.tagNeighbours = function() {
        this.neighbours = [];
        for (var i = 0; i < this.team.pitch.teams.length; i++) {
            for (var j = 0; j < this.team.pitch.teams[i].players.length; j++) {
                if (!this.team.pitch.teams[i].players[j].equals(this) && this.team.pitch.teams[i].players[j].position.distanceSq(this.position) < 10000) {
                    this.neighbours.push(this.team.pitch.teams[i].players[j]);
                }
            }
        }
    };

    this.isClosestTeamMemberToBall = function() {
        return this.team.playerClosestToBall.equals(this);
    };

    this.isControllingPlayer = function() {
        return this.team.controllingPlayer && this.team.controllingPlayer.equals(this);
    };

    this.inHomeRegion = function() {
        return this.homeRegion.center.distanceSq(this.position) < new Param().PlayerKickingDistance * new Param().PlayerKickingDistance;
    };

    this.ballWithinReceivingRange = function() {
        return this.position.distanceSq(this.team.pitch.ball.position) < new Param().BallWithinReceivingRange * new Param().BallWithinReceivingRange;
    };

    this.ballWithinKickingRange = function() {
        return this.position.distanceSq(this.team.pitch.ball.position) < 100;
    };

    this.isThreatened = function() {
        return false; // todo
    };

    this.trackBall = function() {
        var toTarget = this.team.pitch.ball.position.clone();
        toTarget.subtract(this.position);
        toTarget.normalize();
        this.heading = toTarget;

//        var toTarget = this.team.pitch.ball.clone();
//        toTarget = toTarget.subtract(this.position);
//        toTarget.normalize();
//
//        var angle = Math.acos(this.heading.dot(toTarget));
//
//        if (angle < 0.00001) {
//            return true;
//        }
//
//        if (angle > new Param().PlayerMaxTurnRate) {
//            angle = new Param().PlayerMaxTurnRate;
//        }
//        //first determine the angle between the heading vector and the target
//        double angle = Math.acos(m_vHeading.Dot(toTarget));
//
//        //sometimes m_vHeading.Dot(toTarget) == 1.000000002
//        if(Double.isNaN(angle)) {
//            angle = 0;
//        }
//        //return true if the player is facing the target
//        if (angle < 0.00001) {
//            return true;
//        }
//
//        //clamp the amount to turn to the max turn rate
//        if (angle > m_dMaxTurnRate) {
//            angle = m_dMaxTurnRate;
//        }
//
//        //The next few lines use a rotation matrix to rotate the player's heading
//        //vector accordingly
//        C2DMatrix RotationMatrix = new C2DMatrix();
//
//        //notice how the direction of rotation has to be determined when creating
//        //the rotation matrix
//        RotationMatrix.Rotate(angle * m_vHeading.Sign(toTarget));
//        RotationMatrix.TransformVector2Ds(m_vHeading);
//        RotationMatrix.TransformVector2Ds(m_vVelocity);
//
//        //finally recreate m_vSide
//        m_vSide = m_vHeading.Perp();
//
//        return false;
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
            'state': this.stateMachine.currentState.name
        }
    };
}
util.inherits(Player, MovingEntity);

module.exports = Player;
