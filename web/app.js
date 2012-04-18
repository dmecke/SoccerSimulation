var httpServer = require('./httpServer');
httpServer.listen(8000);
var io = require('socket.io').listen(httpServer, { log: false });

var World = require('./world');
var Player = require('./player');

var world = new World();

var playerRed = new Player(1, world);
playerRed.color = 'rgba(255, 0, 0, 100)';
world.players.push(playerRed);

var playerBlue = new Player(2, world);
playerBlue.color = 'rgba(0, 0, 255, 100)';
playerBlue.maxSpeed = 10;
world.players.push(playerBlue);

var playerGreen = new Player(3, world);
playerGreen.color = 'rgba(0, 200, 0, 100)';
playerGreen.maxSpeed = 30;
world.players.push(playerGreen);

io.sockets.on('connection', function(socket) {
    console.log('socket ' + socket.id + ' connected');
    socket.on('disconnect', function() {
        console.log('socket ' + socket.id + ' disconnected');
    });
});

setInterval(function() {
//    console.log('tick (' + io.sockets.clients().length + ' clients connected)');
    world.update();
    io.sockets.emit('render', world);
}, 100);
