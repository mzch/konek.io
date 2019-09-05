const Session = require("../models/session");


module.exports = {

    async removeSession(session) {
        console.log(session)
        Session.findByIdAndRemove({ _id: session })
            .exec((err, session) => {
                if (err) console.log(err)

                if (session) {
                    console.log('successfully destroyed session')
                }

            })

    },

    loadSession(session) {
        return Session.findOne({ _id: session.data._id })
            .exec()
            .then((session) => {
                const payload = {
                    connections: session.connections,
                    code: session.code,
                    _id: session._id
                };

                return payload
            }).catch((err) => {
                throw new Error(err)
            })
    },

    connectToSession(code){
       return Session.findOne({ code })
        .exec()
        .then((session) => {
            const payload = {
                connections: session.connections,
                code: session.code,
                _id: session._id
            };

            return payload
        })
        .catch((err) => {
            throw new Error(err)
        })
    }
}