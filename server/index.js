const express = require('express');
var session = require('express-session')
const bodyParser = require("body-parser");
const io = require('./helpers/socket');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Session = require('./models/session');
const database = 'mongodb://konek:newoneio12@ds263927.mlab.com:63927/konek';
mongoose.connect(database, { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', (err) => {
    console.log(err);
});

db.once('open', () => {
    console.log('connection established');
});


/* PARSER 
    
*/
const port = process.env.PORT || 8080;
io.listen(app.listen(port, () => console.log(`RUNNING on ${port}`)));
app.use(session({ resave: true ,secret: '123456' , saveUninitialized: true}));
app.use(bodyParser.urlencoded({extends: false}));
app.use(bodyParser.json())
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


function loadSession(req, res, next){

     if(!req.session.data){
         console.log('da')
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
                res.render('share', {data: payload});
            } else {
                res.render('error', {message: 'invalid code'});
            }
    });
} 

function generateSession(req, res, next){
    console.log('new session')
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


app.get('/share', generateSession, loadSession);
app.get('/share/:session', loadSession)


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