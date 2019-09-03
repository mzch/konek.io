const Session = require('../../domain/models/session');

module.exports = {
    renderConnect: function(_, res, _) {
        res.render('connect')
    },

    validateCode: function(req, res, next) {
        Session.findOne({ code: req.body.code })
        .exec((err, session) => {
            if (err) throw err;
    
            if (session && req.body.code === session.code) {
                const payload = {
                    connections: session.connections,
                    code: session.code,
                    _id: session._id
                };
                req.session.data = payload;
                next()
            } else {
                res.render('connect', {res: 'Invalid Code'});
            }
        });
    }
}