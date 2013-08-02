var GoalkeeperStateMachine = require('./goalkeeperStateMachine');
var BasePlayer = require('./basePlayer');
var Param = require('./param');
var Vector2d = require('./vector2d');
var util = require('util');

function Goalkeeper(id, team) {
    BasePlayer.call(this, id, team);
    this.stateMachine = new GoalkeeperStateMachine(this);
    this.isGoalkeeper = true;

    this.update = function() {
        this.stateMachine.update();
        this.steeringBehaviours.update();
    };

    this.getRearInterposeTarget = function() {
        var xPosTarget = this.team.getHomeGoal().center.x;
        var yPosTarget = this.team.pitch.playingArea.center.y - new Param().GoalWidth * 0.5 + (this.team.pitch.ball.position.y * new Param().GoalWidth) / this.team.pitch.playingArea.height;

        return new Vector2d(xPosTarget, yPosTarget);
    };

    this.ballWithinRangeForIntercept = function() {
        return this.team.getHomeGoal().center.distanceSq(this.team.pitch.ball.position) <= new Param().GoalKeeperInterceptRange * new Param().GoalKeeperInterceptRange;
    };

    this.tooFarFromGoalMouth = function() {
        return this.position.distanceSq(this.getRearInterposeTarget()) > new Param().GoalKeeperInterceptRange * new Param().GoalKeeperInterceptRange;
    }
}
util.inherits(Goalkeeper, BasePlayer);

module.exports = Goalkeeper;
