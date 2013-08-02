var Vector2d = require('./vector2d');
var Player = require('./player');
var Goalkeeper = require('./goalkeeper');
var TeamStateMachine = require('./teamStateMachine');
var GoalkeeperStateReturnHome = require('./goalkeeperStateReturnHome');
var PlayerStateWait = require('./playerStateWait');
var PlayerStateReturnToHomeRegion = require('./playerStateReturnToHomeRegion');

function Team(id, pitch, color) {
    this.id = id;
    this.color = color;
    this.pitch = pitch;
    this.stateMachine = new TeamStateMachine(this);
    this.players = [];

    var player1 = new Goalkeeper(1, this);
    player1.stateMachine.changeState(new GoalkeeperStateReturnHome());
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
        this.stateMachine.update();
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
            if (this.players[i].isGoalkeeper) {
                this.players[i].stateMachine.changeState(new GoalkeeperStateReturnHome());
            } else {
                this.players[i].stateMachine.changeState(new PlayerStateReturnToHomeRegion());
            }
        }
    };

    this.changePlayerHomeRegions = function(homeRegions) {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].homeRegion = this.pitch.regions[homeRegions[i]];
        }
    };

    this.getOpponent = function() {
        if (this.pitch.teams[0].equals(this)) {
            return this.pitch.teams[1];
        } else {
            return this.pitch.teams[0];
        }
    };

    this.getGoal = function() {
        if (this.pitch.teams[0].equals(this)) {
            return this.pitch.blueGoal;
        } else {
            return this.pitch.redGoal;
        }
    };

    this.getHomeGoal = function() {
        if (this.pitch.teams[0].equals(this)) {
            return this.pitch.redGoal;
        } else {
            return this.pitch.blueGoal;
        }
    };

    this.canShoot = function(ballPosition, power) {

        var numberOfTestedTargets = 10;

        while (numberOfTestedTargets-- > 0) {
            shotTarget = this.getGoal().center;

            var minYval = this.getGoal().leftPost.y + this.pitch.ball.radius;
            var maxYval = this.getGoal().rightPost.y - this.pitch.ball.radius;

            shotTarget.y = parseInt(Math.random() * (maxYval - minYval + 1)) + minYval;

            var time = this.pitch.ball.timeToCoverDistance(ballPosition, shotTarget, power);

            if (time > 0) {
//                if (isPassSafeFromAllOpponents(ballPosition, shotTarget, null, power)) { todo
                    return shotTarget;
//                }
            }
        }

        return false;
    };

    this.canPass = function(passer, receiver, passTarget, power, minimumPassingDistance) {
        return false; // todo
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
