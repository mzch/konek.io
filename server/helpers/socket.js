const socketio = require('socket.io');


module.exports.listen = (app) => {
    const io = socketio.listen(app);
    const session = io.of('/xdawfhkj5hkjsah-ashuahr')
    io.on('connection', function(socket) {
        socket.on("start", function(data) {
            console.log(data, 'start new connection')
        })
    });
}