require('dotenv').config();

const express = require('express');
// const {
//     verifyToken,

// } = require('./middlewares/oauthMiddleware');

const router = express.Router();

const { signIn, signUp } = require('../controllers/userControl');


// auth related routes

router.post('/signin', signIn);

router.post('/create-user', signUp);

module.exports = router;