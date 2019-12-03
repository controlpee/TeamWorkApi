const express = require('express');
require('dotenv').config();
const { Pool } = require('pg');

// // const app = require('./app');
// const bodyParser = require('body-parser');
// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//     cloud_name: 'controlpee',
//     api_key: '84678551758984',
//     api_secret: '384678551758984:bkOdVSk1ppW8-uCMJvgekWP0zg4'
//   });


                                                                                              
  const pool = new Pool({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASS,
database: process.env.DB_NAME,
port: process.env.DB_PORT
    });


//create article
exports.createArticle = async (req, res) => {
    const { article, title } = req.body;
    const userId  = req.users.user_id
    
    await pool.query(`INSERT INTO articles( user_id, article, title ) VALUES ($1, $2, $3) RETURNING *`,
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
       

//create article comment

exports.createArticleComment = async (req, res) => {
    
    const { user_id, author_id } = req.params.id;
     const { comment } = req.body;
    const article_id = req.params.id;
                
    await pool.query('INSERT INTO comments(user_id, article_id, author_id, comment) VALUES($1, $2, $3, $4) RETURNING *',
     
    [ user_id, article_id, author_id, comment ],
     
    async (err, result) => {
                
    if (err) {
                    
    return res.status(400).json({
    
    status: 'error',
                        
    message: 'error posting comment'
                    
    });
                
    }
                
    await pool.query(`SELECT comment, author_id FROM comments 
    JOIN articles_table ON articles_table.id = comments.article_id WHERE comment_id = ${result.rows[0].comment_id}`,
     
   async (error, results) => {
                        
    if (error) {
                            
    return res.status(500).json({
                                
    status: 'error',
                                
    message: 'error retrieving comment from database'
                            
    });
                        
    }
                        
    res.json({
                            
    status: 'success',
                            
    data: {
    comments: [
        {
                                
    message: 'comment successfully created',
    commentId: results.rows[0].comment_id,
    comment: results.rows[0].comment,
    author_id: result.rows[0].author_id
                            
    }
]
    }                   
    });
                    
    });
            
    });
    
    };



    // create gif
exports.createGif = async (req, res) => {
    console.log(req.files);

try {
const image = req.files.images;
await cloudinary.uploader.upload(image.tempFilePath, async (response) => {
});
{
if (response.url !== undefined) {
    await pool.query(`INSERT INTO gifs(title, url, user_id) VALUES($1, $2, $3) RETURNING *`,
    [ req.body.title, response.url, req.user.user_id ], 
    (error, result) => {
if (error) {
    return res.status(500).json({
        status: 'Error',
        message: 'Error uploading gif to the database!'
    });
}
res.status(200).json({
    status: 'success',
    data: [
        {
            message: 'Gif image successfully posted!',
            createdOn: result.rows[0].created_at,
            title: result.rows[0].title,
            ImageUrl: result.rows[0].url
        }
    ]
});
});
} else {
    res.status(500).json({
        status: 'error',
        message: 'error uploading gifs!'
    });
}
}
} catch {
(error) => {
    res.status(500).json({
        error: error
    });
}
}
}




// // Post gif comments
exports.createGifComment = async (req, res) =>{
    const  { userId } = req.params.users.id;
    const { gif_id, author_id } = req.params.id;
    const { comment } = req.body;
 await pool.query(`INSERT INTO comments(user_id, author_id, gif_id, comment) VALUES($1, $2, $3, $4) RETURNING *`,
    [ user_id, author_id, gif_id, comment ],
    async (error, results) => {
     if(error) {
     return res.status(400).json({
 status: 'error',
 message: 'Error posting comment!'
 
     });  
     }   
    });
 
 await pool.query(`SELECT comment FROM comments                                                                                                     
 JOIN gifs_table ON gifs_table.id = comments.gif_id WHERE comment_id = ${results.rows[0].comment_id}`,
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
 data: {
     message: 'Comment successfully created',
     comments: [
         {
        commentId: results.rows[0].comment_id,
        authorId: results.rows[0].author_id,
         comment: results.rows[0].comment

         },
         {
            commentId: results.rows[0].comment_id,
            authorId: results.rows[0].author_id,
             comment: results.rows[0].comment
    
             }
 ]
    }

 
 })
 );
 }


// Update Article

exports.putArticle = async (req, res) => {
    await pool.query(`UPDATE articles_table SET title = ${req.body.title}, 
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
    

// Get Article by id

exports.getOneArticle = async (req, res) => {
    await pool.query(`SELECT article_id, title, article, user_id, created_at, 
    firstname, lastname FROM article JOIN users ON users_id = user_id WHERE 
    article_id = ${ req.params.id }`, 
    async (error, result) => {
        if(error) {
            return res.status(400).json({
                status: 'error',
                message: 'Unable to retrive article from the database!'
            });
        }
    
    await pool.query(`SELECT user_id, comment_id, firstname, lastname, comment FROM article_comments JOIN 
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


// get gif by id

exports.getOneGif = async (req, res) => {
    await pool.query(`SELECT * FROM gifs WHERE id = ${req.params.id}`,
    async (error, result) => {
        if (error) {
            return res.status(500).json({
              status: 'error',
              message: 'Unable to retrive gif from the database!'  
            });
        }
    });
await pool.query(`SELECT user_id, comment_id FROM comments WHERE gif_id = ${req.params.id}`,
async (error, result) => {
    if (error) {
        return res.status(500).json({
            status: 'error',
            message: 'error retriving gif comment from the database!'
        });
    }else {
res.json({
status: 'Success',
data: result.rows[0],
comments: result.rows
        });
    }
});

}



// Get all article

exports.getAll = async (req, res) => {

await pool.query(`SELECT articles_table.id, title, article, user_id, articles_table.created_at, firstname, lastname 
FROM articles_table JOIN users ON users.id = articles_table.user_id UNION ALL 
SELECT gifs_table.id, title, url, user_id, gif_table.created_at, firstname, lastname 
FROM gifs_table JOIN users ON users.id = gifs_table.user_id ORDER BY created_at DESC`,
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




// delete gif

exports.deleteGif = async (req, res) => {
await pool.query(`DELETE FROM gifs_table WHERE id = ${req.params.id}`, 
  (error) => {
          
    if (error) {
            
    res.status(400).json({
    status: 'error',
    message: 'error deleting gif!'
            
    });
          
    } else {
            
    res.status(200).json({
    status: 'success',
    message: 'Gif post deleted successfully'
            
    });
          
    }
        
    });
      
    };

    //Delete article

exports.deleteArticle = async (req, res) => {
    await pool.query(`DELETE FROM artcles_table WHERE id = ${req.params.id}`,
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