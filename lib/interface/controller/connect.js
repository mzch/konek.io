const Session = require('../../domain/models/session');
const SessionService = require('../../domain/service/SessionService');

module.exports = {
    renderConnect: function(_, res, _) {
        res.render('connect')
    },

    validateCode: function(req, res, next) {
        SessionService.connectToSession(req.body.code)
        .then((payload) => {
            req.session.data = payload;
            next()
        })
        .catch(() => {
            res.render('connect', {res: 'Invalid Code'});
        })
    }
}