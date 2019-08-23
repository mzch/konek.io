const express = require('express');
const fs = require('fs');
var session = require('express-session')
const bodyParser = require("body-parser");
const io = require('./helpers/socket');
const multer = require('multer');
const socketio = require('socket.io');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Session = require('./models/session');
const Text = require('./models/text');
const File = require('./models/file');
const DataUri = require('datauri');
const database = 'mongodb://konek:newoneio12@ds263927.mlab.com:63927/konek';
mongoose.connect(database, { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', (err) => {
    console.log(err);
});
db.once('open', () => {
    console.log('connection established');
});

const storage = multer.memoryStorage();
const upload = multer({ storage });


/* PARSER 
    
*/
const port = process.env.PORT || 8080;
const socketSession = socketio.listen(app.listen(port, () => console.log(`RUNNING on ${port}`)));
app.use(session({ resave: true ,secret: '123456' , saveUninitialized: true}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', function(req, res) {
    res.render('index');
});



// app.get('/share', function(req, res, next) {
//     console.log('new session')
//         const session = new Session({});
//         session.save((err, data) => {
//             if (err) {
//                 res.status(500).json({ message: 'Internal Server Error', type: 'error' });
//             }

//             if (data) {
//                 req.session = data;
//                 next()
//             }
//         });
    
// }, (req, res) => {
//     res.redirect(`/share/${req.session._id}`)
// });

socketSession.on('connection', (socket) => {
    console.log("A new user just connected");
  
    socket.on('join', (session) => {
      console.log('NEW CLIENT JOINED SESSION:', session)
      socket.join(session);
      socket['session-identity'] = session;
      console.log('SESSION CLIENTS:', socketSession.sockets.adapter.rooms[session].sockets)

      socketSession.to(session).emit('updateClients', socketSession.sockets.adapter.rooms[session].sockets);
    })
    
    socket.on('newFile', function(event) {
        console.log('NEW FILES', event.data)
        socket.to(event.session).emit('updateFiles', event.data);
        
    })

    socket.on('newText', function(event) {
        console.log('NEW TEXT', event)
        socket.to(event.session).emit('updateText', event.data);
        
    })

    // socketSession.on('connection', (socket) => {
    //     console.log('emit new files')
    //     socket.emit('newFile', ok.FileArray)
    // })
    // socket.on('disconnect', () => {
    //     const socketFrom = socket['session-identity'];
    //     socketSession.to(socketFrom).emit('updateClients', socketSession.sockets.adapter.rooms[socketFrom].sockets);
    //     delete socket['session-identity'];
    // });
});

function ValidateCode(req, res, next){
    Session.findOne({ code: req.body.code })
    // .select('+password')
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
            res.render('error', {message: 'invalid code'});
        }
    });
}

function loadSession(req, res, next){
          
     if(!req.session.data){
         console.log('Require attributes are empty')
        return res.render('error', {message: 'invalid code'});
    }
    
    Session.findOne({ _id: req.session.data._id })
        // .select('+password')
        .exec((err, session) => {
            if (err) throw err;

            if (session && req.session.data.code === session.code) {
                const payload = {
                    connections: session.connections,
                    code: session.code,
                    _id: session._id
                };
                res.render('share', {data: payload, clients_count: 0});
            } else {
                res.render('error', {message: 'invalid code'});
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



function handleFiles(req, res, next) {
    var buffer = req.file.buffer
    var finalImg = {
         contentType: req.file.mimetype,
         image:  new Buffer(buffer, 'base64'),
         fileName: req.file.originalname,
         size: req.file.size
      };

      File.findOneAndUpdate( { 
          SessionId : req.session.data._id  
        },  
        { 
            $push: { 
                    FileArray: finalImg  
                } 
        }, 
        { 
            upsert : true ,
            new: true
        }, 
        
        (err, ok) => {
            if(err){
                return res.status(501).json({ data: [], code: 501 });
            }

            if(ok){
                return res.status(200).json({ data: ok, code: 200 });
            }
      });
    
    
}

function checkContentType(req, res, next){
        const text = {
            text: req.body.text,
            _id: mongoose.Types.ObjectId()
        };
        console.log(req.body)
        Text.findOneAndUpdate( { 
            SessionId : req.session.data._id  
          },  
          { 
              $push: { 
                      TextArray: text 
                  } 
          }, 
          { 
              upsert : true ,
              new: true
          }, 
          
          (err, ok) => {
              if(err){
                  return res.status(501).json({ data: [], code: 501 });
              }
  
              if(ok){
                  return res.status(200).json({ data: ok, code: 200 });
              }
        });
}


app.get('/share', generateSession, loadSession);

app.get('/share/:session', loadSession)
app.post('/share/file', upload.single('sessionFile'), handleFiles)
app.post('/share/message', checkContentType)
app.get('/connect', connectToSession);
app.post('/connect', ValidateCode, loadSession);
app.use(function(req, res, next) {
    return res.status(404).render('404');
  });


function connectToSession(req, res){
    res.render('connect')
}



// app.get('/share/:session', function(req, res) {
//     console.log(req.session)
//     if(!req.session){
//         return res.render('error', {message: 'invalid code'});
//     }

//     Session.findOne({ _id: req.params.session })
//         // .select('+password')
//         .exec((err, session) => {
//             if (err) throw err;

//             if (session && req.session.code === session.code) {
//                 const payload = {
//                     connections: session.connections,
//                     code: session.code,
//                     _id: session._id
//                 };
//                 res.render('share', {data: payload});
//             } else {
//                 res.render('error', {message: 'invalid code'});
//             }
//     });
// })

