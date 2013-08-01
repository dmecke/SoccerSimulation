var httpServer = require('./httpServer');
httpServer.listen(8000);
var io = require('socket.io').listen(httpServer, { log: false });

var fps = 60;

var Pitch = require('./pitch');
var Team = require('./team');
var Ball = require('./ball');
var Vector2d = require('./vector2d');
var TeamStatePrepareForKickOff = require('./teamStatePrepareForKickOff');

var pitch = new Pitch();
pitch.createRegions();

var teamRed = new Team(1, pitch, 'rgba(255, 0, 0, 100)');
teamRed.stateMachine.changeState(new TeamStatePrepareForKickOff());
pitch.teams.push(teamRed);

var teamBlue = new Team(2, pitch, 'rgba(0, 0, 255, 100)');
teamBlue.stateMachine.changeState(new TeamStatePrepareForKickOff());
pitch.teams.push(teamBlue);

pitch.ball = new Ball();

io.sockets.on('connection', function(socket) {
    console.log('socket ' + socket.id + ' connected');
    socket.on('disconnect', function() {
        console.log('socket ' + socket.id + ' disconnected');
    });
    socket.on('setFps', function(fps) {
        clearInterval(updateInterval);
        updateInterval = startInterval(fps);
    });
});

function startInterval(fps) {
    var updateInterval = setInterval(function() {
//        console.log('tick (' + io.sockets.clients().length + ' clients connected)');
        pitch.update();
        io.sockets.emit('render', pitch);
    }, Math.round(1000 / fps));

    return updateInterval;
}
var updateInterval = startInterval(fps);
