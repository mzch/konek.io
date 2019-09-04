const mongoose = require('mongoose');

module.exports = (config) => {

    const database = `mongodb://${config.username}:${config.password}@ds263927.mlab.com:63927/konek`;
    mongoose.connect(database, { useNewUrlParser: true });
        
    conn.on('error', (err) => {
        throw new TypeError('Unable to connect to database.');
    });

    conn.once('open', () => {
        console.log('connection established');
    });
    
    function close(){
        console.log('closed');
        mongoose.connection.close();
    }

}