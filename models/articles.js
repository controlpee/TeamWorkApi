const express = require('express');
const app = require('./app');
const bodyParser = require('body-parser');


exports.createArticle = async (req, res) => {
    const { article, title } = req.body;
    const userId  = req.users.user_id
    
    await client.query(`INSERT INTO articles( user_id, article, title ) VALUES ($1, $2, $3) RETURNING *`,
        [ userId, article, title ],

        async (error, result) => {
            if(error) {
            return res.status(400).json({
                status: 'Error',
                message: 'Error creating article!' 
            });  
 }else{
    const successData = {
        status: 'Success',
        data: [
            {
            message: 'Article successfully created!',
            createdOn: results.rows[0].created_at,
            articleId: results.rows[0].article_id,
            title: results.rows[0].title
        }
    ]
    }
 }


});
res.status(200).json(successData);
}
       


// Get one Article

exports.getOneArticle = async (req, res) => {
await client.query(`SELECT article_id, title, article, user_id, created_at, 
firstname, lastname FROM article JOIN users ON users_id = user_id WHERE 
article_id = ${ req.params.id }`, 
async (error, result) => {
    if(error) {
        return res.status(400).json({
            status: 'error',
            message: 'Unable to retrive article from the database!'
        });
    }

await client.query(`SELECT user_id, comment_id, firstname, lastname, comment FROM article_comments JOIN 
users ON users.id = article_comments.user_id WHERE article_id = ${req.params.id}`,
async (error, result) => {
    if(error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error retriving comment from the database!',
        });
    } else {
        res.status(200).json({
            status: 'Success',
            data: results.rows[0],
            comments: result.rows            
        });
    }
    
});
});
}


// Update Article

exports.putArticle = async (req, res) => {
await client.query(`UPDATE articles_table SET title = ${req.body.title}, 
article = ${req.body.article} WHERE user_id = ${req.users.user_id}
AND article_id = ${req.params.id}`, 
async (error, result) => {
if(error) {
    return res.status(400).json({
       status: 'Error',
        message: 'Unable to update article! '
    });
if (result.rows[0] === undefined) {
    return res.status(201).json({
        Message: 'You cannot edit other users post! '
    });
}else{
    res.status(200).json({
        Status: 'Success',
        data: [
            {
            Message: 'Article successfully updated! ',
            tittle: result.rows[0].title,
            article: result.rows[0].article,
            articleId: result.rows[0].article_id
        }
    ]
    });
}

}
});
}


//Delete article

exports.deleteArticle = async (req, res) => {
    await client.query(`DELETE FROM artcles_table WHERE id = ${req.params.id}`,
(error) => {
if(error) {
    return res.status(400).json({
        status: 'Error',
        message: 'error deleting article!'
    });
}else {
    res.status(201).json({
        status: 'Success',
        message: 'Article post deleted successfully!'
        })
}
});
}


//Get all article

exports.getAllArticles = async (req, res) => {

await client.query(`SELECT article_table.id, title, article, user_id, article_table.created_at, firstname, lastname 
FROM article_table JOIN users ON users.id = article_table.user_id UNION ALL SELECT gif_table.id, title, url, user_id, gif_table.created_at, firstname, lastname FROM gif_table JOIN users ON users.id = gif_table.user_id ORDER BY created_at DESC`,
async (error, result) => {
    if (error) {

        console.log(error);

return res.status(400).json({
status: 'error',
message: 'error retriving posts!'
});
    }else{
        res.json({
            status: 'Success',
            data: result.rows
        });
    }
});   
}
