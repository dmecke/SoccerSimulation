var jquery = require('jquery');
var Vector2d = require('./vector2d');
var Ball = require('./ball');
var Goal = require('./goal');
var TeamStatePrepareForKickOff = require('./teamStatePrepareForKickOff');
var Param = require('./param');
var Region = require('./region');

function Pitch() {
    this.teams = [];
    this.ball = new Ball();
    this.regions = [];
    this.playingArea = new Region(20, 20, new Param().WindowWidth - 20, new Param().WindowHeight - 20);
    this.redGoal = new Goal(new Vector2d(this.playingArea.left, (new Param().WindowHeight - new Param().GoalWidth) / 2), new Vector2d(this.playingArea.left, new Param().WindowHeight - (new Param().WindowHeight - new Param().GoalWidth) / 2), new Vector2d(1, 0));
    this.blueGoal = new Goal(new Vector2d(this.playingArea.right, (new Param().WindowHeight - new Param().GoalWidth) / 2), new Vector2d(this.playingArea.right, new Param().WindowHeight - (new Param().WindowHeight - new Param().GoalWidth) / 2), new Vector2d(-1, 0));
    this.gameOn = false;
    this.numRegionsHorizontal = 6;
    this.numRegionsVertical = 3;

    this.update = function() {
        this.ball.update();
        jquery.each(this.teams, function(index, team) {
            team.update();
        });

        if (!this.gameOn && this.teams[0].allPlayersAtHome() && this.teams[1].allPlayersAtHome()) {
            this.gameOn = true;
        }

        if (this.blueGoal.scored(this.ball) || this.redGoal.scored(this.ball)) {
            this.gameOn = false;

            this.ball.position = new Vector2d(this.playingArea.center.x, this.playingArea.center.y);
            this.ball.velocity = new Vector2d(0, 0);

            this.teams[0].stateMachine.changeState(new TeamStatePrepareForKickOff());
            this.teams[1].stateMachine.changeState(new TeamStatePrepareForKickOff());
        }
    };

    this.createRegions = function() {
        for (var col = 0; col < this.numRegionsHorizontal; ++col) {
            for (var row = 0; row < this.numRegionsVertical; ++row) {
                this.regions.push(
                    new Region(
                        this.playingArea.left + col * this.playingArea.width / this.numRegionsHorizontal,
                        this.playingArea.top + row * this.playingArea.height / this.numRegionsVertical,
                        this.playingArea.left + (col + 1) * this.playingArea.width / this.numRegionsHorizontal,
                        this.playingArea.top + (row + 1) * this.playingArea.height / this.numRegionsVertical
                    )
                );
            }
        }
    };

    this.goalkeeperHasBall = function() {
        return this.teams[0].players[0].isControllingPlayer() || this.teams[1].players[0].isControllingPlayer();
    };

    this.toJSON = function() {
        return {
            'playingArea': this.playingArea,
            'teams': this.teams,
            'ball': this.ball,
            'redGoal': this.redGoal,
            'blueGoal': this.blueGoal,
            'regions': this.regions
        }
    };
}

module.exports = Pitch;
