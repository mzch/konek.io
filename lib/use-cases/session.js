const Session = require('../domain/models/session');


module.exports = {

    newSession: function(){
        return new Promise(function(resolve, reject) {
            const session = new Session({});
            session.save((err, data) => {
                if (err) {
                    reject({ message: 'Internal Server Error', type: 'error' })
                }
    
                if (data) {
                    resolve(data)
                }
            });
        })
    }
    
}