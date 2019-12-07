require('dotenv').config();
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const cloudinary = require('cloudinary');

cloudinary.config({
    
    cloud_name: process.env.CLOUD_NAME,
        
    api_key: process.env.CLOUD_KEY,
        
    api_secret: process.env.CLOUD_SECRET
    
    });


    const pool = new Pool({
    
        host: process.env.DB_HOST,
            
        user: process.env.DB_USER,
            
        password: process.env.DB_PASS,
            
        database: process.env.DB_NAME,
            
        port: process.env.DB_PORT
        });


const postArticle = async (req, res) => {
    
const { title } = req.body;
    
const { article } = req.body;
    
const userId = req.user.user_id;

    
await pool.query(
`INSERT INTO article_table(user_id, article, title) VALUES($1, $2, $3) RETURNING *`,
 
[userId, article, title],
        
async (error, result) => {
            
if (error) {
                
return res.status(400).json({ 
message: 'cannot post article at this time' 
});
            
}
            
const successData = {
                
status: 'success',
                
data: {
                    
message: 'Article successfully posted',
                    
articleId: result.rows[0].id,
                    
title: result.rows[0].title
                
}
            
};
            
res.status(200).json(successData);
        
}
);

};


// DONE


const postArticleComment = async (req, res) => {
    
const { user_id } = req.user;
    
const article_id = req.params.id;
    
const { comment } = req.body;
    
await pool.query(`INSERT INTO article_comments(user_id, article_id, comment) VALUES($1, $2, $3) RETURNING *`,
 
[user_id, article_id, comment],
 
async (err, result) => {
            
if (error) {
                
return res.status(400).json({

status: 'error',
                    
message: 'error posting comment'
                
});
            
}
            
await pool.query(`SELECT article, title, comment FROM article_comments 
JOIN article_table ON article_table.id = article_comments.article_id WHERE comment_id = ${result.rows[0].comment_id} `,
 
(error, results) => {
                    
if (error) {
                        
return res.status(400).json({
                            
status: 'error',
                            
message: 'error retrieving comment from database'
                        
});
                    
}
                    
res.json({
                        
status: 'success',
                        
data: {
                            
message: 'comment successfully created',
                            
article_title: results.rows[0].title,
                            
article: results.rows[0].article,
                            
comment: results.rows[0].comment
                        
}
                    
});
                
});
        
}
);

};


// DONE


const postGif = async (req, res) => {
    
console.log(req.files);
    
try {
        
const image = req.files.image;
        
await cloudinary.uploader.upload(image.tempFilePath, async (response) => {
            if (response.url !== undefined) {
                
await pool.query(
`INSERT INTO gif_table(title, url, user_id) VALUES($1, $2, $3) RETURNING *`,
 
[req.body.title, response.url, req.users.user_id],
                    
(error, result) => {
                        
if (error) {
                            
return res.status(400).json({
status: 'error',
                                
message: 'error uploading gif to database'
});
                        
}

                        
res.status(200).json(result.rows);
                    
}
                
);
            
} else {
                
res.status(400).json({
status: 'error',
                    
message: 'error uploading gif'
                
});
            
}
        
});
    
} catch {
        
error => {
            
res.json(error);
        
};
    
}
};


// DONE

const postGifComment = async (req, res) => {
    
const { user_id } = req.user;
    
const gif_id = req.params.id;
    
const { comment } = req.body;
    
await pool.query(
`INSERT INTO gif_comments(user_id, gif_id, comment) VALUES($1, $2, $3) RETURNING *`,
        
[user_id, gif_id, comment],
        
async (errpr, result) => {
            
if (error) {
                
return res.status(400).json({
status: 'error',
                    
message: 'error posting comment'
                
});
            
}
            
await pool.query(`SELECT title, comment FROM gif_comments JOIN 
gif_table ON gif_table.id = gif_comments.gif_id WHERE comment_id = ${result.rows[0].comment_id} `,
                (error, results) => {
                    
if (error) {
                        
return res.status(400).json({
                            
status: 'error',
                            
message: 'error retrieving comment from database'
                        
});
                    
}
                    
res.json({
                        
status: 'success',
                        
data: {
                            
message: 'comment successfully created',
                            
gif_title: results.rows[0].title,
                            
comment: results.rows[0].comment
                        
}
                    
});
                
}
            
);
        
}
    
);

};



const patchArticle = async (req, res) => {
    
await pool.query(`UPDATE article_table SET title = '${req.body.title}', 
article = '${req.body.article}' WHERE user_id = ${req.user.user_id} AND id = ${req.params.id} RETURNING *`,
 
(error, result) => {
        
if (error) {
          
return res.status(400).json({ 
status: 'error', 
message: 'error updating article' 
});
        
}
        
if (result.rows[0] === undefined) {
          
return res.status(201).json({ 
message: 'you cannot edit another users post' 
});
        
}
  
        
res.status(200).json({
status: 'success',
          
data: [
    {
            
        message: 'Article successfully updated',
                    
        title: result.rows[0].title,
                    
        article: result.rows[0].article,
                    
        articleId: result.rows[0].id
                  
        }
] 
        
});
      
}
    
);
  
};
  

const deleteGif = async (req, res) => {
    
await pool.query(`DELETE FROM gif_table WHERE id = ${req.params.gif_id}`, 
(error, result) => {
      
if (error) {
        
res.status(400).json({
          
status: 'error',
          
message: 'error deleting gif'
        
});
      
} else {
        
res.status(200).json({
          
status: 'success',
          
message: 'gif post deleted successfully'
        
});
      
}
    
});
  
};
  

const deleteArticle = async (req, res) => {
    
await pool.query(`DELETE FROM article_table WHERE id = ${req.params.id}`,
      
(error, reesult) => {
        
if (error) {
          
res.status(400).json({
            
status: 'error',
            
message: 'error deleting article'
          
});
        
} else {
          
res.status(200).json({
            
status: 'success',
            
message: 'article post deleted successfully'
          
});
        
}
      
}
);
  
};
  


const getAll = async (req, res) => {
    
await pool.query(
`SELECT article_table.id, title, article, user_id, 
article_table.created_at, firstname, lastname FROM article_table 
JOIN users ON users.id = article_table.user_id UNION ALL 
SELECT gif_table.id, title, url, user_id, gif_table.created_at, 
firstname, lastname FROM gif_table JOIN users ON users.id = gif_table.user_id ORDER BY created_at DESC`,
      
async (error, result) => {
        
if (error) {
          
console.log(err);
  
          
return res.status(400).json({
            
status: 'error',
            
message: 'error retrieving posts'
          
});
        
} else {
          
res.status(200).json({
            
data: result.rows
          
});
        
}
      
});
  
};
  

const getOneGif = async (req, res) => {
    
await pool.query(`SELECT gif_table.id, title, url, user_id, gif_table.created_at, firstname, lastname 
FROM gif_table JOIN users ON users.id = gif_table.user_id  WHERE gif_table.id = ${req.params.id}`,
      
async (error, results) => {
       
if (error) {
          
console.log(error);
  
          
return res.status(400).json({
            
status: 'error',
            
message: 'error retrieving gif from database'
          
});
        
}
        
await pool.query(`SELECT gif_comments.user_id, comment_id, firstname, lastname, comment 
FROM gif_comments JOIN users ON users.id = gif_comments.user_id  WHERE gif_id = ${req.params.id}`,
          
async (error, result) => {
            
if (error) {
              
return res.status(400).json({
                
status: 'error',
                
message: 'error retrieving gif comments from database'
              
});
            
}
            
res.json({
              
status: 'success',
              
data: results.rows[0],
              
comments: result.rows
            
});
          
}
);
      
});
  
};
  

const getOneArticle = async (req, res) => {
    
await pool.query(`SELECT article_table.id, title, article, user_id, article_table.created_at, firstname, lastname 
FROM article_table JOIN users ON users.id = article_table.user_id  WHERE article_table.id = ${req.params.id}`,
      
async (error, results) => {
        
if (error) {
          
return res.status(400).json({
            
status: 'error',
            
message: 'error retrieving article from database'
          
});
        
}
        
await pool.query(`SELECT article_comments.user_id, comment_id, firstname, lastname, comment 
FROM article_comments JOIN users ON users.id = article_comments.user_id  WHERE article_id = ${req.params.id}`,
          
async (error, result) => {
            
if (error) {
              
return res.status(400).json({
                
status: 'error',
                
message: 'error retrieving comments from database'
              
});
            
}
            
res.json({
              
status: 'success',
              
data: results.rows[0],
              
comments: result.rows
            
});
          
});
      
});
  
};
  
module.exports = {

postArticle,
    
postGif,
    
postGifComment,
    
postArticleComment,
    
patchArticle,
    
deleteGif,
    
deleteArticle,
    
getAll,
    
getOneGif,
    
getOneArticle
  
};
  