function Param() {
    this.GoalWidth = 100;

    this.WindowWidth = 700;
    this.WindowHeight = 400;

    this.BallSize = 5;
    this.BallMass = 1;
    this.Friction = -0.015;

    this.PlayerKickingDistance = 6;

    this.PlayerMass = 3;
    this.PlayerMaxForce = 1;
    this.PlayerMaxSpeedWithBall = 1.2;
    this.PlayerMaxSpeedWithoutBall = 1.6;
    this.PlayerMaxTurnRate = 0.4;

    this.PlayerKickingAccuracy = 0.99;

    this.MaxShootingForce = 6;
    this.MaxPassingForce = 3;

    this.GoalKeeperTendingDistance = 20;

    this.GoalKeeperInterceptRange = 100;

    this.BallWithinReceivingRange = 10;
}

module.exports = Param;
