require('dotenv').config();

const express = require('express');

const router = express.Router();
const {
  postArticle,
  postArticleComment,
  postGif,
  postGifComment,
  patchArticle,
  deleteArticle,deleteGif,getAll, getOneGif, getOneArticle
} = require('../controllers/main');


const { verifyToken } = require('../middlewares/oauthMiddleware');


// post routes

router.post('/articles', verifyToken, postArticle);

router.post('/articles/:id/comment', verifyToken, postArticleComment);

router.post('/gifs/:id/comment', verifyToken, postGifComment);

router.post('/gifs', verifyToken, postGif);



// patch route

router.patch('/articles/:id', verifyToken, patchArticle);


// delete routes
router.delete('/articles/:id', verifyToken, deleteArticle);

router.delete('/gifs/:id', verifyToken, deleteGif);


// get routes

router.get('/feed', verifyToken, getAll);

router.get('/gifs/:id', verifyToken, getOneGif);

router.get('/articles/:id', verifyToken, getOneArticle);


module.exports = router;
