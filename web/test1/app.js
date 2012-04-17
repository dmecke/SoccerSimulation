var httpServer = require('./httpServer');
httpServer.listen(8000);
var socketServer = require('socket.io').listen(httpServer, { log: false });
var clients = [];

socketServer.sockets.on('connection', function(socket) {
    clients.push(socket);
    socket.on('newMessage', function(msg) {
        for (i = 0; i < clients.length; i++) {
            clients[i].emit('updateMessageList', msg);
        }
    });
});

var Player = require('./player');
var SoccerPitch = require('./soccerPitch');
var pitch = new SoccerPitch();
pitch.players.push(new Player('red'));
pitch.players.push(new Player('blue'));

setInterval(function() {
    for (i = 0; i < pitch.players.length; i++) {
        pitch.players[i].update();
    }
    for (i = 0; i < clients.length; i++) {
        clients[i].emit('tick', pitch.toJson());
    }
}, 100);
