var PlayerStateMachine = require('./playerStateMachine');
var BasePlayer = require('./basePlayer');
var Vector2d = require('./vector2d');
var Param = require('./param');
var util = require('util');
var jquery = require('jquery');

function Player(id, team, role) {
    BasePlayer.call(this, id, team, role);
    this.neighbours = [];
    this.stateMachine = new PlayerStateMachine(this);

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
        //check against all opponents to make sure non are within this
        //player's comfort zone
        jquery.each(this.team.getOpponent().players, function(index, player) {
            //calculate distance to the player. if dist is less than our
            //comfort zone, and the opponent is infront of the player, return true
            if (this.positionInFrontOfPlayer(player.position) && this.position.distanceSq(player.position) < new Param().PlayerComfortZone * new Param().PlayerComfortZone) {
                return true;
            }
        });

        return false;
    };

    this.isAheadOfAttacker = function() {
        return Math.abs(this.position.x - this.team.getGoal().center.x) < Math.abs(this.team.controllingPlayer.position.x - this.team.getGoal().center.x);
    };
}
util.inherits(Player, BasePlayer);

module.exports = Player;
