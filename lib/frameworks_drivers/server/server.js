require('dotenv').config()
const express = require('express');
const session = require('express-session')
const bodyParser = require("body-parser");
const path = require('path');


/* server lib */
const io = require('../socket');
const initDB = require('../database')

function createServer(router) {

    const app = express();
    const port = process.env.PORT || 8080;
    const secret_key = process.env.SECRET_KEY || '123456';
    const db_host = process.env.DB_HOST || 'localhost';
    const db_port = process.env.DB_PORT || 27017;
    const db_name = process.env.DB_NAME || 'konek';
    const db_user = process.env.DB_USER;
    const db_pass = process.env.DB_PASS;

    app.use(session({ resave: true, secret: secret_key, saveUninitialized: true }));
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }));
    app.set('views', path.join(__dirname, '../../../views'));
    app.set('view engine', 'ejs');
    app.use(express.static(path.join(__dirname, '../../../public')));


    /* DB initializaiton */
    initDB.config({ host: db_host, port: db_port, db: db_name, username: db_user, password: db_pass })
    /* -------------------------------------------------------- */


    io.socketUtility(app.listen(port, () => console.log(`RUNNING on ${port}`)));

    router().dispatch(app);

    return app;
}

module.exports = createServer;