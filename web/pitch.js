var jquery = require('jquery');
var Vector2d = require('./vector2d');
var Region = require('./region');

function Pitch() {
    this.teams = [];
    this.ball = null;
    this.regions = [];
    this.gameOn = false;

    this.update = function() {
        this.ball.update();
        jquery.each(this.teams, function(index, team) {
            team.update();
        });

        if (!this.gameOn && this.teams[0].allPlayersAtHome() && this.teams[1].allPlayersAtHome()) {
            this.gameOn = true;
        }
    };

    this.setUpRegions = function() {
        this.regions.push(new Region(new Vector2d(1100, 500))); // 0
        this.regions.push(new Region(new Vector2d(1100, 300))); // 1
        this.regions.push(new Region(new Vector2d(1100, 100))); // 2

        this.regions.push(new Region(new Vector2d(900, 500))); // 3
        this.regions.push(new Region(new Vector2d(900, 300))); // 4
        this.regions.push(new Region(new Vector2d(900, 100))); // 5

        this.regions.push(new Region(new Vector2d(700, 500))); // 6
        this.regions.push(new Region(new Vector2d(700, 300))); // 7
        this.regions.push(new Region(new Vector2d(700, 100))); // 8

        this.regions.push(new Region(new Vector2d(500, 500))); // 9
        this.regions.push(new Region(new Vector2d(500, 300))); // 10
        this.regions.push(new Region(new Vector2d(500, 100))); // 11

        this.regions.push(new Region(new Vector2d(300, 500))); // 12
        this.regions.push(new Region(new Vector2d(300, 300))); // 13
        this.regions.push(new Region(new Vector2d(300, 100))); // 14

        this.regions.push(new Region(new Vector2d(100, 500))); // 15
        this.regions.push(new Region(new Vector2d(100, 300))); // 16
        this.regions.push(new Region(new Vector2d(100, 100))); // 17
    };

    this.goalkeeperHasBall = function() {
        return this.teams[0].players[0].isControllingPlayer() || this.teams[1].players[0].isControllingPlayer();
    };

    this.toJSON = function() {
        return {
            'teams': this.teams,
            'ball': this.ball
        }
    };
}

module.exports = Pitch;
