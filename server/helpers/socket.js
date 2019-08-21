
const socketio = require('socket.io');


var listen = (io) => {

    // io.on('connection', function(socket) {
    //         socket.on('create', function (room) {
    //             console.log('NEW SHARING SESSION STARTED:', room)
    //             socket.join(room);

    //           });
            
    //           socket.on('join', function (room) {
    //             console.log('NEW CLIENT JOINED SESSION:', room)
    //             socket.join(room);
    //             // let clients = io.sockets.clients(room);
    //             io.sockets.in(room).emit('updateClients', io.sockets.adapter.rooms[room].sockets);
    //             console.log('SESSION CLIENTS:', io.sockets.adapter.rooms[room].sockets)
    //           });

    //           socket.on('leave', function(room) {
    //             console.log('A CLIENT LEFT SESSION:', room)

    //          });
    //         //   socket.on('leave', function (room) {
    //         //     console.log('A CLIENT LEFT SESSION:', room)
    //         //     socket.leave(room);
    //         //     // let clients = io.sockets.clients(room);
    //         //     io.sockets.in(room).emit('updateClients', io.sockets.adapter.rooms[room].sockets);
    //         //     console.log('SESSION CLIENTS:', io.sockets.adapter.rooms[room].sockets)
    //         //   });
    //     });  


}


module.exports = {
    listen: listen
}