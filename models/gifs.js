const express = require('express');
const pg = require('./app');
const bodyParser = require('body-parser');

exports.createGifs = async (req, res) => {
    console.log(req.files);

try {
const image = req.files.images;
await cloudinary.uploader.upload(image.tempFilePath, async (response) => {
});
{
if (response.url !== undefined) {
    await client.query(`INSERT INTO gifs(title, url, user_id) VALUES($1, $2, $3) RETURNING *`,
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
    }
    )
}
}
}

// get gif by id

exports.getOneGif = async (req, res) => {
    await client.query(`SELECT * FROM gifs WHERE id = ${req.params.id}`,
    async (error, result) => {
        if (error) {
            return res.status(500).json({
              status: 'error',
              message: 'Unable to retrive gif from the database!'  
            });
        }
    });
await client.query(`SELECT user_id, comment_id, comment, author_id FROM gif_comments WHERE gif_id = ${req.params.id}`,
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
comment: result.rows
        });
    }
});

}



exports.deleteGifs = async (req, res) => {
await client.query(`DELETE FROM gif_table WHERE id = ${req.params.id}`, 
  (error) => {
          
    if (error) {
            
    res.status(400).json({
    status: 'error',
    message: 'error deleting gif!'
            
    });
          
    } else {
            
    res.status(200).json({
    status: 'success',
    message: 'if post deleted successfully'
            
    });
          
    }
        
    });
      
    };