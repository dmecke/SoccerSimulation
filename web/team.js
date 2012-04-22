var Player = require('./player');
var TeamStateMachine = require('./teamStateMachine');
var PlayerStateWait = require('./playerStateWait');
var PlayerStateReturnToHomeRegion = require('./playerStateReturnToHomeRegion');

function Team(id, pitch, color) {
    this.id = id;
    this.color = color;
    this.pitch = pitch;
    this.stateMachine = new TeamStateMachine(this);
    this.players = [];

    var player1 = new Player(1, this);
    player1.stateMachine.changeState(new PlayerStateWait());
    this.players.push(player1);

    var player2 = new Player(2, this);
    player2.stateMachine.changeState(new PlayerStateWait());
    this.players.push(player2);

    var player3 = new Player(3, this);
    player3.stateMachine.changeState(new PlayerStateWait());
    this.players.push(player3);

    var player4 = new Player(4, this);
    player4.stateMachine.changeState(new PlayerStateWait());
    this.players.push(player4);

    var player5 = new Player(5, this);
    player5.stateMachine.changeState(new PlayerStateWait());
    this.players.push(player5);

    this.playerClosestToBall = player1;
    this.receivingPlayer = null;
    this.controllingPlayer = null;
    this.supportingPlayer = null;

    this.update = function() {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].update();
        }

        this.updatePlayerClosestToBall();
    };

    this.updatePlayerClosestToBall = function() {
        var closestToBallDistance = null;
        for (var i = 0; i < this.players.length; i++) {
            var thisPlayersDistanceToBall = this.players[i].position.distanceSq(this.pitch.ball.position);
            if (closestToBallDistance == null || thisPlayersDistanceToBall  < closestToBallDistance) {
                closestToBallDistance = thisPlayersDistanceToBall;
                this.playerClosestToBall = this.players[i];
            }
        }
    };

    this.inControl = function() {
        return this.controllingPlayer != null;
    };

    this.allPlayersAtHome = function() {
        for (var i = 0; i < this.players.length; i++) {
            if (!this.players[i].inHomeRegion()) {
                return false;
            }
        }
        return true;
    };

    this.returnAllFieldPlayersToHome = function() {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].stateMachine.changeState(new PlayerStateReturnToHomeRegion());
        }
    };

    this.changePlayerHomeRegions = function(homeRegions) {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].homeRegion = this.pitch.regions[homeRegions[i]];
        }
    };

    this.equals = function(team) {
        return this.id == team.id;
    };

    this.toJSON = function() {
        return {
            'players' : this.players,
            'state': this.stateMachine.currentState.name
        }
    };
}

module.exports = Team;
