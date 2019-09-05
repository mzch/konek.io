
const socketio = require('socket.io');
const SessionService = require('../../domain/service/SessionService');

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
            const session = socket['session-identity'];
            /* Destroy session on last client disconneciton */
            if(socketSession.sockets.adapter.rooms[session] === undefined) return SessionService.removeSession(session);

            /* Session still have remaining clients, remove socket from session & update clients count */ 
            socket.leave(session);
            socketSession.to(session).emit('updateClients', socketSession.sockets.adapter.rooms[session].sockets);
            
        });
    });

}


module.exports = {
    socketUtility: socketUtility
}