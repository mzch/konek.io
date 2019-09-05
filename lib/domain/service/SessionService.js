const mongoose = require("mongoose");
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

    }
}