var jquery = require('jquery');
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
            if (!this.players[i].isGoalkeeper) {
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
                if (this.isPassSafeFromAllOpponents(ballPosition, shotTarget, null, power)) {
                    return shotTarget;
                }
            }
        }

        return false;
    };

    this.findPass = function(passer, receiver, passTarget, power, minPassingDistance) {
        var closestToGoalSoFar = 1000000000000;
        var target = new Vector2d(0, 0);
        var passerPosition = passer.position.clone();
        var that = this;

        var finded = false;
        //iterate through all this player's team members and calculate which
        //one is in a position to be passed the ball
        jquery.each(this.players, function(index, curPlyr) {
            var currentPlayerPosition = curPlyr.position.clone();
            //make sure the potential receiver being examined is not this player
            //and that it is further away than the minimum pass distance
            if ((!curPlyr.equals(passer)) && (passerPosition.distanceSq(currentPlayerPosition) > minPassingDistance * minPassingDistance)) {
                if (that.getBestPassToReceiver(passer, curPlyr, target, power)) {
                    //if the pass target is the closest to the opponent's goal line found
                    // so far, keep a record of it
                    var Dist2Goal = Math.abs(target.x - that.getOpponent().getHomeGoal().center.x);

                    if (Dist2Goal < closestToGoalSoFar) {
                        closestToGoalSoFar = Dist2Goal;

                        //keep a record of this player
                        receiver = curPlyr;

                        //and the target
                        passTarget = target;

                        finded = true;
                    }
                }
            }
        });

        return finded;
    };

    this.getBestPassToReceiver = function(passer, receiver, passTarget, power) {
        //first, calculate how much time it will take for the ball to reach
        //this receiver, if the receiver was to remain motionless
        var time = this.pitch.ball.timeToCoverDistance(this.pitch.ball.position, receiver.position, power);

        //return false if ball cannot reach the receiver after having been
        //kicked with the given power
        if (time < 0) {
            return false;
        }

        //the maximum distance the receiver can cover in this time
        var interceptRange = time * receiver.maxSpeed;

        //Scale the intercept range
        var scalingFactor = 0.3;
        interceptRange *= scalingFactor;

        //now calculate the pass targets which are positioned at the intercepts
        //of the tangents from the ball to the receiver's range circle.
        var ip1 = new Vector2d(0, 0);
        var ip2 = new Vector2d(0, 0);

        var Helper = require('./helper');
        new Helper.getTangentPoints(receiver.position, interceptRange, this.pitch.ball.position, ip1, ip2);

        var passes = new Array(ip1, receiver.position, ip2);
        var NumPassesToTry = passes.length;

        // this pass is the best found so far if it is:
        //
        //  1. Further upfield than the closest valid pass for this receiver
        //     found so far
        //  2. Within the playing area
        //  3. Cannot be intercepted by any opponents

        var closestSoFar = 100000000000;
        var bResult = false;

        for (var pass = 0; pass < NumPassesToTry; ++pass) {
            var dist = Math.abs(passes[pass].x - this.getOpponent().getHomeGoal().center.x);

            if ((dist < closestSoFar) && this.pitch.playingArea.isInside(passes[pass]) && this.isPassSafeFromAllOpponents(this.pitch.ball.position, passes[pass], receiver, power)) {
                closestSoFar = dist;
                passTarget = passes[pass];
                bResult = true;
            }
        }

        return bResult;
    };

    this.isPassSafeFromAllOpponents = function(from, target, receiver, passingForce) {
        var that = this;
        jquery.each(this.getOpponent().players, function(index, player) {
            if (!that.isPassSafeFromOpponent(from, target, receiver, player, passingForce)) {
                return false;
            }
        });
        return true;
    };

    this.isPassSafeFromOpponent = function(from, target, receiver, opponent, passingForce) {
        //move the opponent into local space.
        var localTarget = target.clone();
        var toTarget = localTarget.subtract(from);
        var toTargetNormalized = toTarget.normalize();
        var opponentPosition = opponent.position.clone();

        var Helper = require('./helper');
        var localPositionOpponent = new Helper().pointToLocalSpace(opponentPosition, toTargetNormalized, toTargetNormalized.perp(), from);

        //if opponent is behind the kicker then pass is considered okay(this is
        //based on the assumption that the ball is going to be kicked with a
        //velocity greater than the opponent's max velocity)
        if (localPositionOpponent.x < 0) {
            return true;
        }

        //if the opponent is further away than the target we need to consider if
        //the opponent can reach the position before the receiver.
        if (from.distanceSq(target) < opponentPosition.distanceSq(from)) {
            if (receiver != null) {
                return localTarget.distanceSq(opponentPosition) > localTarget.distanceSq(receiver.position);
            } else {
                return true;
            }
        }

        //calculate how long it takes the ball to cover the distance to the
        //position orthogonal to the opponents position
        var timeForBall = this.pitch.ball.timeToCoverDistance(new Vector2d(0, 0), new Vector2d(localPositionOpponent.x, 0), passingForce);

        //now calculate how far the opponent can run in this time
        var reach = opponent.maxSpeed * timeForBall + pitch.ball.radius;

        //if the distance to the opponent's y position is less than his running
        //range plus the radius of the ball and the opponents radius then the
        //ball can be intercepted
        return !Math.abs(localPositionOpponent.y) < reach;
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
