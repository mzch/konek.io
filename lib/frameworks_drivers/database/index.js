const mongoose = require('mongoose');

module.exports = {
    config: (config) => {
        /* DB initializaiton */
        mongoose.set('useFindAndModify', false);
        const conn = mongoose.connection;
        const database = `mongodb://${config.username}:${config.password}@ds263927.mlab.com:63927/konek`;
        const connect = () => {
            return mongoose.connect(database, { useNewUrlParser: true }, err => {
                if (err) throw err;
            })
            .catch((err) => {
                if (err) {
                    console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
                    setTimeout(connect, 5000);
                }
            })
        }


        conn.on('error', (err) => {
            throw new TypeError('Unable to connect to database.');
        });

        conn.once('open', () => {
            console.log('connection established');
        });


        connect()
    }

}