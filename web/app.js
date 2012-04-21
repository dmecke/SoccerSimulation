var httpServer = require('./httpServer');
httpServer.listen(8000);
var io = require('socket.io').listen(httpServer, { log: false });

var Pitch = require('./pitch');
var Player = require('./player');

var pitch = new Pitch();

var playerRed = new Player(1, pitch);
playerRed.color = 'rgba(255, 0, 0, 100)';
pitch.players.push(playerRed);

var playerBlue = new Player(2, pitch);
playerBlue.color = 'rgba(0, 0, 255, 100)';
playerBlue.maxSpeed = 10;
pitch.players.push(playerBlue);

var playerGreen = new Player(3, pitch);
playerGreen.color = 'rgba(0, 200, 0, 100)';
playerGreen.maxSpeed = 30;
pitch.players.push(playerGreen);

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
