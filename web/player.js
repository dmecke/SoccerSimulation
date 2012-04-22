var PlayerStateMachine = require('./playerStateMachine');
var MovingEntity = require('./movingEntity');
var util = require('util');

function Player(id, team) {
    MovingEntity.call(this);

    this.id = id;
    this.color = team.color;
    this.team = team;
    this.neighbours = [];
    this.stateMachine = new PlayerStateMachine(this);
    this.homeRegion = null;

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
        return this.team.controllingPlayer.equals(this);
    };

    this.inHomeRegion = function() {
        return this.homeRegion.center.distanceSq(this.position) < 100;
    };

    this.equals = function(player) {
        return this.id == player.id && this.team.equals(player.team);
    };

    this.toJSON = function() {
        return {
            'color': this.color,
            'position': this.position,
            'headingPosition' : this.headingPosition,
            'currentTarget': this.steeringBehaviours.currentTarget,
            'state': this.stateMachine.currentState.name
        }
    };
}
util.inherits(Player, MovingEntity);

module.exports = Player;
