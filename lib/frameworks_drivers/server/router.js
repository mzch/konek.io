const shareController = require('../../interface/controller/share');
const connectController = require('../../interface/controller/connect');
const uploadFile = require('../../interface/storage/multer-storage')

function router() {
  return { dispatch };

  function dispatch(app) {
    app.get('/', function (req, res) {
      res.render('index');
    });

    app.get('/share', shareController.generateSession, shareController.loadSession);
    app.get('/share/:session', shareController.loadSession);
    app.post('/share/file', uploadFile, shareController.handleFiles);
    app.post('/share/message', shareController.handleTexts)
    app.get('/connect', connectController.renderConnect);
    app.post('/connect', connectController.validateCode, shareController.loadSession);
    app.use(function (req, res, next) {
      return res.status(404).render('404');
    });

  }
}

module.exports = router;