var Vector2d = require('./vector2d');
var SteeringBehaviours = require('./steeringBehaviours');
var PlayerStateMachine = require('./playerStateMachine');

function Player(id, pitch) {
    this.id = id;
    this.position = new Vector2d(300, 200);
    this.width = 10;
    this.height = 10;
    this.mass = 1;
    this.maxSpeed = 20;
    this.maxForce = 5;
    this.velocity = new Vector2d(0, 0);
    this.heading = new Vector2d(0, 15);
    this.headingPosition = this.position.clone();
    this.headingPosition.add(this.heading);
    this.color = 'rgba(255, 0, 0, 100)';
    this.steeringBehaviours = new SteeringBehaviours(this);
    this.pitch = pitch;
    this.neighbours = [];
    this.stateMachine = new PlayerStateMachine(this);

    this.update = function() {
        this.tagNeighbours();

        this.stateMachine.update();
        this.steeringBehaviours.update();
    };

    this.tagNeighbours = function() {
        this.neighbours = [];
        for (var i = 0; i < this.pitch.players.length; i++) {
            if (!this.pitch.players[i].equals(this) && this.pitch.players[i].position.distanceSq(this.position) < 10000) {
                this.neighbours.push(this.pitch.players[i]);
            }
        }
    };

    this.updateVelocity = function(steeringForce) {
        this.velocity.add(steeringForce);
        this.velocity.truncate(this.maxSpeed);
    };

    this.updatePosition = function() {
        this.position.add(this.velocity);
        if (this.position.x > 595) {
            this.position.x = 595;
        }
        if (this.position.x < 5) {
            this.position.x = 5;
        }
        if (this.position.y > 395) {
            this.position.y = 395;
        }
        if (this.position.y < 5) {
            this.position.y = 5;
        }
    };

    this.updateHeading = function() {
        this.heading = this.velocity.clone();
        this.heading.normalize();
    };

    this.updateHeadingPosition = function() {
        this.headingPosition = this.position.clone();
        var headingClone = this.heading.clone();
        headingClone.multiply(15);
        this.headingPosition.add(headingClone);
    };

    this.equals = function(player) {
        return this.id == player.id;
    };

    this.toJSON = function() {
        return {
            'color': this.color,
            'width': this.width,
            'height': this.height,
            'position': this.position,
            'headingPosition' : this.headingPosition,
            'currentTarget': this.steeringBehaviours.currentTarget
        }
    };
}

module.exports = Player;
