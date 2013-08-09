var Vector2d = require('./vector2d');
var Param = require('./param');
var SupportSpot = require('./supportSpot');
var jquery = require('jquery');

function SupportSpotCalculator(numX, numY, team) {
    this.bestSupportingSpot = null;
    this.team = team;
    this.playingArea = team.pitch.playingArea;

    //calculate the positions of each sweet spot, create them and
    //store them in m_Spots
    this.heightOfSSRegion = this.playingArea.height * 0.8;
    this.widthOfSSRegion = this.playingArea.width * 0.9;
    this.sliceX = this.widthOfSSRegion / numX;
    this.sliceY = this.heightOfSSRegion / numY;

    this.left = this.playingArea.left + (this.playingArea.width - this.widthOfSSRegion) / 2.0 + this.sliceX / 2.0;
    this.right = this.playingArea.right - (this.playingArea.width - this.widthOfSSRegion) / 2.0 - this.sliceX / 2.0;
    this.top = this.playingArea.top + (this.playingArea.height - this.heightOfSSRegion) / 2.0 + this.sliceY / 2.0;

    this.spots = [];

    for (var x = 0; x < (numX / 2) - 1; ++x) {
        for (var y = 0; y < numY; ++y) {
            if (this.team.name == 'Blue') {
                this.spots.push(new SupportSpot(new Vector2d(this.left + x * this.sliceX, this.top + y * this.sliceY), 0));
            } else {
                this.spots.push(new SupportSpot(new Vector2d(this.right - x * this.sliceX, this.top + y * this.sliceY), 0));
            }
        }
    }

    /**
     * this method iterates through each possible spot and calculates its
     * score.
     */
    this.determineBestSupportingPosition = function() {
        //reset the best supporting spot
        this.bestSupportingSpot = null;

        var bestScoreSoFar = 0;
        var that = this;

        jquery.each(this.spots, function(index, spot) {
            //first remove any previous score. (the score is set to one so that
            //the viewer can see the positions of all the spots if he has the
            //aids turned on)
            spot.score = 1;

            //Test 1. is it possible to make a safe pass from the ball's position
            //to this position?
            if (that.team.isPassSafeFromAllOpponents(that.team.controllingPlayer.position, spot.position, null, new Param().MaxPassingForce)) {
                spot.score += new Param().Spot_CanPassScore;
            }

            //Test 2. Determine if a goal can be scored from this position.
            if (that.team.canShoot(spot.position, new Param().MaxShootingForce)) {
                spot.score += new Param().Spot_CanScoreFromPositionScore;
            }

            //Test 3. calculate how far this spot is away from the controlling
            //player. The further away, the higher the score. Any distances further
            //away than OptimalDistance pixels do not receive a score.
            if (that.team.supportingPlayer != null) {

                var optimalDistance = 200;

                var distance = that.team.controllingPlayer.position.distance(spot.position);

                var temp = Math.abs(optimalDistance - distance);

                if (temp < optimalDistance) {

                    //normalize the distance and add it to the score
                    spot.score += new Param().Spot_DistFromControllingPlayerScore * (optimalDistance - temp) / optimalDistance;
                }
            }

            //check to see if this spot has the highest score so far
            if (spot.score > bestScoreSoFar) {
                bestScoreSoFar = spot.score;

                that.bestSupportingSpot = spot;
            }
        });

        return this.bestSupportingSpot.position;
    };

    /**
     * returns the best supporting spot if there is one. If one hasn't been
     * calculated yet, this method calls DetermineBestSupportingPosition and
     * returns the result.
     */
    this.getBestSupportingSpot = function() {
        if (this.bestSupportingSpot != null) {
            return this.bestSupportingSpot.position;
        } else {
            return this.determineBestSupportingPosition();
        }
    };
}

module.exports = SupportSpotCalculator;
