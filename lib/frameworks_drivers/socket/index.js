
const socketio = require('socket.io');

var socketUtility =  (app) => {
    const socketSession = socketio.listen(app)
    

    socketSession.on('connection', (socket) => {


        socket.on('join', async (session) => {
          socket.join(session);
          socket['session-identity'] = session;
          socketSession.to(session).emit('updateClients', socketSession.sockets.adapter.rooms[session].sockets);
        })
        
        socket.on('newFile', function(event) {
            socket.to(event.session).emit('updateFiles', event.data);
            
        })
    
        socket.on('newText', function(event) {
            socket.to(event.session).emit('updateText', event.data);
            
        })
    
    
        socket.on('disconnect', () => {
            const socketFrom = socket['session-identity'];
            if(socketSession.sockets.adapter.rooms[socketFrom] === undefined) return;


            socket.leave(socketFrom);
            socketSession.to(socketFrom).emit('updateClients', socketSession.sockets.adapter.rooms[socketFrom].sockets);

        });
    });

}


module.exports = {
    socketUtility: socketUtility
}