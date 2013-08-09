function Param() {
    this.GoalWidth = 100;

    //use to set up the sweet spot calculator
    this.NumSweetSpotsX = 13;
    this.NumSweetSpotsY = 6;

    //these values tweak the various rules used to calculate the support spots
    this.Spot_CanPassScore = 2;
    this.Spot_CanScoreFromPositionScore = 1;
    this.Spot_DistFromControllingPlayerScore = 2;
    this.Spot_ClosenessToSupportingPlayerScore = 0;
    this.Spot_AheadOfAttackerScore = 0;

    this.SupportSpotUpdateFreq = 1;

    this.WindowWidth = 700;
    this.WindowHeight = 400;

    this.ChanceOfUsingArriveTypeReceiveBehavior = 0.5;

    this.BallSize = 5;
    this.BallMass = 1;
    this.Friction = -0.015;

    this.PlayerInTargetRange = 10;

    this.PlayerKickingDistance = 6;

    this.PlayerMass = 3;
    this.PlayerMaxForce = 1;
    this.PlayerMaxSpeedWithBall = 1.2;
    this.PlayerMaxSpeedWithoutBall = 1.6;
    this.PlayerMaxTurnRate = 0.4;

    this.PlayerComfortZone = 60;

    this.PlayerKickingAccuracy = 0.99;

    this.MaxShootingForce = 6;
    this.MaxPassingForce = 3;

    this.GoalkeeperMinPassDist = 50;

    this.GoalKeeperTendingDistance = 20;

    this.GoalKeeperInterceptRange = 100;

    this.BallWithinReceivingRange = 10;
}

module.exports = Param;
