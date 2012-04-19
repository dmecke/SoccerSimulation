var Vector2d = require('./vector2d');
var SteeringBehaviours = require('./steeringBehaviours');

function Player(id, world) {
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
    this.currentTarget = new Vector2d(300, 200);
    this.steeringBehaviours = new SteeringBehaviours(this);
    this.world = world;
    this.neighbours = [];

    this.update = function() {
        if (this.position.distanceSq(this.currentTarget) < 100) {
            this.currentTarget.x = Math.random() * 600;
            this.currentTarget.y = Math.random() * 400;
        }
        this.tagNeighbours();

        var steeringForce = this.calculateSteeringForce();
        steeringForce.divide(this.mass);
        this.velocity.add(steeringForce);
        this.velocity.truncate(this.maxSpeed);
        this.position.add(this.velocity);
        this.heading = this.velocity.clone();
        this.heading.normalize();

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

        this.updateHeadingPosition();
    };

    this.calculateSteeringForce = function() {
        var steeringForce = new Vector2d(0, 0);
//        steeringForce.add(this.steeringBehaviours.seekSteeringForce(this.currentTarget));
        steeringForce.add(this.steeringBehaviours.arriveSteeringForce(this.currentTarget));
        steeringForce.add(this.steeringBehaviours.separationSteeringForce(this.currentTarget));

        steeringForce.truncate(this.maxForce);

        return steeringForce;
    };

    this.tagNeighbours = function() {
        this.neighbours = [];
        for (var i = 0; i < this.world.players.length; i++) {
            if (!this.world.players[i].equals(this) && this.world.players[i].position.distanceSq(this.position) < 10000) {
                this.neighbours.push(this.world.players[i]);
            }
        }
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
            'currentTarget': this.currentTarget
        }
    };
}

module.exports = Player;
