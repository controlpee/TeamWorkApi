const express = require('express');
const bodyParser = require('body-parser');
const app = require('./app');


const createArticleComment = async (req, res) => {

    const { user_id } = req.user;
    const article_id  = req.params.id;
    const { comment } = req.body;
    const { author_id } = req.author;
await client.query(`INSERT INTO article_comments(user_id, article_id, comment, author_id) VALUES ($1, $2, $3) RETURNING *`,
[ user_id, article_id, comment ],
    (error, result) => {
        if (error) {
return res.status(400).json({
status: 'Error',
message: 'Error posting comment!'
});
}
});
await client.query(`SELECT article, title, comment FROM article_comments JOIN article_table ON article_table.id =
article_comments.article_id WHERE comment_id = ${result.rows[0].comment_id}`, 
(error, result) => {
if (error) {
 return  res.status(400).json({
        status: 'Error',
        message: 'Unable to retrive comment from database!',
    });
}else{
    res.status(200).json({
        status: 'Success',
        data: [
            {
            message: 'Comment successfully created!',
            articleTitle: results.rows[0].title,
            article: results.rows[0].article,
            comment: results.rows[0].comment,
            authorId: results.rows[0].author_id
            }
        ]
        
    });
}
});
}

const getOneArticleComment = async (req, res) => {
    await client.query(`SELECT * FROM article_comments_table WHERE id = ${ req.params.id }`, 
  async (error, result) => {
      if (error) {
          return res.status(400).json({
              status: 'Error',
              message: 'Unable to retrive data!'
          });
      }
    });
await client.query(`SELECT user_id, article_id, comment FROM article_comments WHERE article_comments_id = ${ req.params.id }`,
async (error, result) => {
    if(error) {
return res.status(400).json({
status: 'Error!',
message: 'Unable to retrieve comment!'
});
}else{
    res.json({
        status: 'Success',
        data: result.rows[0],
        comments: result.rows 
    });
}
});

}

// update Article comment

const putArticleComment = async (req, res) => {
 await client.query(`UPDATE comment_table SET `,
 async (error, result) => {
   if(error) {
       return res.status(400).json({
           status: 'Error!',
           message: 'Error updating article comment!'
       });
if (error === undefined) {
        return res.status(201).json({
            Message: 'You cannot edit other users comment! '
        });
}else{
    res.status(200).json({
        status: 'Success',
        data: {
        message: 'Comment successfully updated!',
        createdOn: result.rows[0].created_at

        }
    });
}
}  
 });
}

const deleteArticleComment = async (req, res) => {
    await client.query(`DELETE FROM artcles_comment_table WHERE id = ${ req.params.id }`,
    (error) => {
        if(error) {
            return res.status(400).json({
                status: 'Error',
                message: 'error deleting article!'
            });
        }else {
            res.status(201).json({
                status: 'Success',
                message: 'Comment deleted successfully!'
                });
        }
        });
}

const getAllArticleComments = async (req, res) => {
    await client.query(`SELECT * FROM article_comment_table UNION ALL SELECT * FROM article_table ORDER BY created_at DESC`,
    async (error, result) => {
        if (error) {
    return res.status(400).json({
    status: 'error',
    message: 'error retriving posts!'
    });
        }else{
            res.status(200).json({
                status: 'Success',
                data: result.rows
            });
        }
    });  
}
