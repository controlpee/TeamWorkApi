const express = require('express');
const app = require('./app');
const bodyParser = require('body-parser');

// Post gif comments
const createGifsComment = async (req, res) =>{
   const  userId = req.params.users.user_id;
   const { gif_id } = req.params.id;
   const { comment } = req.body;
await client.query(`INSERT INTO gif_comments(user_id, gif_id, comment) VALUES($1, $2, $3) RETURNING *`,
   [user_id, gif_id, comment],
   async (error, results) => {
    if(error) {
    return res.status(400).json({
status: 'error',
message: 'Error posting comment!',

    });  
    }   
   });

await client.query(`SELECT title, comment FROM gif_comment 
JOIN gif_table ON gif_table.id = gif_comment.gif_id WHERE comment_id = ${results.rows[0].comment_id}`,
async (error, result) => {
    if(error) {
     return res.status(400).json({
      status: 'error',
      message: 'Error retriving comment from database!', 
     });   
    }
},
res.status(200).json({
status: 'Success',
data: [
    {
    message: 'Comment successfully created',
    gifTitle: results.rows[0].title,
    createdOn: results.row[0].created_at,
    comment: results.rows[0].comment
}
]
})
);
}



//get gif comment by id

const getOneGifComment = async (req, res) => {
    await client.query(`SELECT FROM gif_comments_table WHERE id = ${req.params.id}`,
    async (error, result) => {
            if (error) {
                return res.status(400).json({
                    status: 'error!',
                    message: 'Unable to retrive comment from the database!'
                });
            }
           });
await client.query(`SELECT user_id, gif_id, comment FROM gif_comments WHERE gif_comments_id = ${req.params.id}`,
    async (error, result) => {
        if (error) {
            return res.status(400).json({
                status: 'Error!',
                message: 'Unable to retrieve comment!'
                });
        }else {
            res.status(200).json({
                status: 'Success',
                data: result.rows[0],
                comment: result.rows
            })
        }
    });


}
