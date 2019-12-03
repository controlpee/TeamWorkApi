require('dotenv').config();

const express = require('express');


const router = express.Router();

const {
  loginUser, registerUser
} 

const userControl = require('../controllers/userControl');


// auth related routes

router.post('/login', loginUser);

router.post('/register', registerUser);

module.exports = router;