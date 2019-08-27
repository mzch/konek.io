/* libs */
require('dotenv').config()
const express = require('express');
const session = require('express-session')
const bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
/* server lib */
const io = require('./helpers/socket');
const config = require('./helpers/utils')
const Session = require('./models/session');
const Text = require('./models/text');
const File = require('./models/file');

const app = express();

/* DB initializaiton */
config.database({username: process.env.DB, password: process.env.DB_PASS })
/* -------------------------------------------------------- */


const storage = multer.memoryStorage();
const upload = multer({ storage });

const port = process.env.PORT || 8080;
io.socketUtility(app.listen(port, () => console.log(`RUNNING on ${port}`)));

/* APP SPECIFIC MIDDLEWARE */
app.use(session({ resave: true ,secret: '123456' , saveUninitialized: true}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../public')));

/* -------------------------------------------------- */

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/share', generateSession, loadSession);
app.get('/share/:session', loadSession)
app.post('/share/file', upload.single('sessionFile'), function handleFiles(req, res, next) {
    var buffer = req.file.buffer
    var finalImg = {
         contentType: req.file.mimetype,
         image:  new Buffer(buffer, 'base64'),
         fileName: req.file.originalname,
         size: req.file.size
      };

      res.status(200).json({ data: finalImg, code: 200 });
    
    
})
app.post('/share/message', checkContentType)
app.get('/connect', connectToSession);
app.post('/connect', ValidateCode, loadSession);
app.use(function(req, res, next) {
    return res.status(404).render('404');
  });


function ValidateCode(req, res, next){
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

function loadSession(req, res, next){
          
     if(!req.session.data){
        return res.render('connect', {res: 'Invalid Code'});
    }
    
    Session.findOne({ _id: req.session.data._id })
        .exec((err, session) => {
            if (err) throw err;

            if (session && req.session.data.code === session.code) {
                const payload = {
                    connections: session.connections,
                    code: session.code,
                    _id: session._id
                };

                req.session.data = payload;
                res.render('share', {data: payload, clients_count: 0});
            } else {
                res.render('connect', {res: 'Invalid Code'});
            }
    });
} 

function generateSession(req, res, next){
    
            const session = new Session({});
            session.save((err, data) => {
                if (err) {
                    res.status(500).json({ message: 'Internal Server Error', type: 'error' });
                }
    
                if (data) {
                    req.session.data = data;
                    req.session.save(function(err) {
                        res.redirect(`/share/${data._id}`)
                      })
                   
                }
            });
}




function checkContentType(req, res, next){
        const text = {
            text: req.body.text,
            _id: mongoose.Types.ObjectId()
        };
     
        res.status(200).json({ data: text, code: 200 });
}


function connectToSession(req, res){
    res.render('connect')
}

