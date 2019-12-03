const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const upload = require('./middlewares/multer');
const cloudinary = require('./controllers/cloudinary');
const fs = require('fs');
// const fileupload = require('express-fileupload');
// const oauthRoute = require('./routes/oauthRoute');

const mainRoute = require('./routes/mainRoute');

const {verifyToken} = require('./middlewares/oauthMiddleware');





const app = express();



// const connectionString = "postgres://xjgkceil:41mVU8IB6HPOf7d4jSnkAeBmAHIKg4a1@salt.db.elephantsql.com:5432/xjgkceil";
 
//   const client = new pg.Client(connectionString);
//   client.connect((err) => {
//     if(err) {
//       return console.error('could not connect to the database', err);
//     }
//     client.query('SELECT NOW() AS "theTime"', (err, result) =>{
//       if(err) {
//         return console.error('error running query', err);
//       }
//       console.log('Successfully connected to Elephantsql database!');
//      client.end();
//     });
//   });         


      
      

// connecting the client and server side to communicate 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
    });
   
   
   
    app.use(bodyParser.json());
    // app.use(fileupload({ useTempFiles: true }));
    app.use(cookieParser({ httpOnly: true }));

    app.use(bodyParser.urlencoded({extended: false}));
    app.use('/image', express.static(path.join(__dirname, 'image')));
   
    app.use('/api/v1/auth', verifyToken);

app.use('/api/v1/', verifyToken);

module.exports = app;