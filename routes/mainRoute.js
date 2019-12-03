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
const {deleteArticle} = require('../controllers/main')
const {deleteGif} = require('../controllers/main')


const router = express.Router();


// const {
//   createArticle,
//   createArticleComment,
//   createGif,
//   createGifComment,
//   putArticle,
//   deleteArticle,
//   deleteGif,
//   getAll,
//   getOneGif,
//   getOneArticle
// }




                                                                                                                    



// post routes

router.post('/articles', createArticle);

router.post('/articles/:id/comment', createArticleComment);

router.post('/gifs', createGif);                                                                                                                                  

router.post('/gifs/:id/comment', createGifComment);


// patch route

router.put('/articles/:id', putArticle);

// delete routes
router.delete('/articles/:id', deleteArticle);

router.delete('/gifs/:id', deleteGif);


// get routes

router.get('/feed', getAll);

router.get('/gifs/:id', getOneGif);

router.get('/articles/:id', getOneArticle);


module.exports = router;
