require('dotenv').config();

const express = require('express');
const {createArticle} = require('../controllers/main')
const {createArticleComment} = require('../controllers/main')
const {createGif} = require('../controllers/main')
const {createGifComment} = require('../controllers/main')
const {getOneArticle} = require('../controllers/main')
const {putArticle} = require('../controllers/main')
const {getOneGif} = require('../controllers/main')
const {getAll} = require('../controllers/main')
const {verifyToken} = require('../middlewares/oauthMiddleware');

const router = express.Router();


const {
  createArticle,
  createArticleComment,
  createGif,
  createGifComment,
  putArticle,
  deleteArticle,
  deleteGif,
  getAll,
  getOneGif,
  getOneArticle
}




                                                                                                                    



// post routes

router.post('/articles', verifyToken, createArticle);

router.post('/articles/:id/comment', verifyToken, createArticleComment);

router.post('/gifs', verifyToken, createGif);                                                                                                                                  

router.post('/gifs/:id/comment', verifyToken, createGifComment);


// patch route

router.put('/articles/:id', verifyToken, putArticle);

// delete routes
router.delete('/articles/:id', verifyToken, deleteArticle);

router.delete('/gifs/:id', verifyToken, deleteGif);


// get routes

router.get('/feed', verifyToken, getAll);

router.get('/gifs/:id', verifyToken, getOneGif);

router.get('/articles/:id', verifyToken, getOneArticle);


module.exports = router;
