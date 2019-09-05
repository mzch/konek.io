const SessionManager = require('../../use-cases/session');
const SessionService = require('../../domain/service/SessionService');


module.exports = {
    generateSession: async function(req, res, next) {
        try {
            const data = await SessionManager.newSession();
            if(data) {
                req.session.data = data;
                req.session.save(function(err) {
                    res.redirect(`/share/${data._id}`)
                })
            }
        } catch (err) {
            res.status(500).json(err);
        }


    },


    loadSession: function(req, res, next) {
        if(!req.session.data){
            return res.render('connect', {res: 'Invalid Code'});
        }

        SessionService.loadSession(req.session)
        .then((payload) => {
            console.log(payload)
            req.session.data = payload;
            res.render('share', {data: payload, clients_count: 0});
        })
        .catch((err) => {
            res.status(500).json(err);
        })
    },


    handleFiles: function(req, res, next){
        var buffer = req.file.buffer

        var finalImg = {
             contentType: req.file.mimetype,
             image: new Buffer(buffer, 'base64').toString('base64'),
             fileName: req.file.originalname,
             size: req.file.size
          };
          
          res.status(200).json({ data: finalImg, code: 200 });  
    },

    handleTexts: function(req, res, next) {
        const text = {
            text: req.body.text,
        };
     
        res.status(200).json({ data: text, code: 200 });
    }
}