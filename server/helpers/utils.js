const mongoose = require('mongoose');

module.exports = {
    database: (config) => {
                /* DB initializaiton */
        const database = `mongodb://${config.username}:${config.password}@ds263927.mlab.com:63927/konek`;
        mongoose.connect(database, { useNewUrlParser: true });
        mongoose.set('useFindAndModify', false);
        const db = mongoose.connection;

        db.on('error', (err) => {
            console.log(err);
        });

        db.once('open', () => console.log('connection establised'));
    }

}