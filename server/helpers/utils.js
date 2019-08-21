const socketio = require('socket.io');

const io = socketio.listen(app);


module.exports.sessionHandler = () => {
    function createSocketSession() {
        io.on('connection', function(socket) {
            socket.on('create', function (room) {
                console.log('NEW SHARING SESSION STARTED:', room)
                socket.join(room);
                let clients = io.sockets.clients(room);
                console.log('SESSION CLIENTS:', clients)
              });
            
        
        });  

    }

    function joinSocketSession(){
        io.on('connection', function(socket) {
            socket.on('join', function (room) {
                console.log('NEW CLIENT JOINED SESSION:', room)
                socket.join(room);
                let clients = io.sockets.clients(room);
                console.log('SESSION CLIENTS:', clients)
              });
            
        
        });    
    }

}