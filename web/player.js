var PlayerStateMachine = require('./playerStateMachine');
var BasePlayer = require('./basePlayer');
var Vector2d = require('./vector2d');
var Param = require('./param');
var util = require('util');

function Player(id, team) {
    BasePlayer.call(this, id, team);
    this.neighbours = [];
    this.stateMachine = new PlayerStateMachine(this);
    this.isGoalkeeper = false;

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

    this.ballWithinKickingRange = function() {
        return this.position.distanceSq(this.team.pitch.ball.position) < 100;
    };

    this.isThreatened = function() {
        return false; // todo
    };
}
util.inherits(Player, BasePlayer);

module.exports = Player;
