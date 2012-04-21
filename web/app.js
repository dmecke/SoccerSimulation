var httpServer = require('./httpServer');
httpServer.listen(8000);
var io = require('socket.io').listen(httpServer, { log: false });

var Pitch = require('./pitch');
var Team = require('./team');
var Ball = require('./ball');

var pitch = new Pitch();

var teamRead = new Team(1, pitch, 'rgba(255, 0, 0, 100)');
pitch.teams.push(teamRead);

var teamBlue = new Team(2, pitch, 'rgba(0, 0, 255, 100)');
pitch.teams.push(teamBlue);

pitch.ball = new Ball();
pitch.ball.steeringBehaviours.seek = true;

io.sockets.on('connection', function(socket) {
    console.log('socket ' + socket.id + ' connected');
    socket.on('disconnect', function() {
        console.log('socket ' + socket.id + ' disconnected');
    });
});

setInterval(function() {
//    console.log('tick (' + io.sockets.clients().length + ' clients connected)');
    pitch.update();
    io.sockets.emit('render', pitch);
}, 100);
