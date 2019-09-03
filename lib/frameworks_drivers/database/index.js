const mongoose = require('mongoose');

module.exports = {
    config: (config) => {
                /* DB initializaiton */
        mongoose.set('useFindAndModify', false);
        const conn = mongoose.connection;
        const database = `mongodb://${config.username}:${config.password}@ds263927.mlab.com:63927/konek`;
        mongoose.connect(database, { useNewUrlParser: true }, err => {
            if(err) throw err;
        })
        .catch((err) => {
            if(err) console.log('reconnecting');
        })
        
        conn.on('error', (err) => {
            throw new TypeError('Unable to connect to database.');
        });

        conn.once('open', () => {
            console.log('connection established');
        });

    }

}