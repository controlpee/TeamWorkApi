const express = require('express');
const bodyParser = require('body-parser');
// const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const oauthRoute = require('./routes/oauthRoute');
const mainRoute = require('./routes/mainRoute');


const app = express();




app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
  });



app.use(fileupload({ useTempFiles: true }));

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser({ httpOnly: true }));


app.use('/api/v1/auth', oauthRoute);

app.use('/api/v1/', mainRoute);


app.use('*', (req, res) => {
  
res.status(404);
  
res.send({
    error: 'page not found'
  });
});


module.exports = app;
