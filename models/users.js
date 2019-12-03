// const pg = require('pg');
// const app = require('/app');
const bodyParser = require('body-parser');


const createUsers = async (req, res) => {
    const { firstname, lastname, email, password, gender, jobrole, department, address } = req.body;

 await client.query(`INSERT INTO users(firstname, lastname, email, password, gender, jobrole, department, address) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
     [ firstname, lastname, email, password, gender, jobrole, department, address ],

    async (err, results) => {
     if(error) {
     return res.status(400).json({
 status: 'error',
 message: 'Error creating account!'
 
     });  
     }else{
        const userData = {
                staus: 'success',
                data: [
                    {          
                    message: 'Account successfully created!',
                    user_id: results.rows[0].user_id
                  }
                ] 
        } 

     }   
});

res.status(200).json(userData);

 }

 const getOneUser = async (req, res) => {
      await client.query(`SELECT * FROM users WHERE user_id = ${results.rows[0].user_id} `,
 (error, results) => {
     if(error) {
      return res.status(400).json({
       status: 'error',
       message: 'Error unable to retrive user data!', 
      });   
     }
 });
 
 await client.query(`SELECT `)

 }


 


 const getAllUsers = async(req, res) => {
    const { user_id } = req.params;
    const { firstname,lastname,email,password,gender,jobrole,department,address } = req.body;
    await client.query(
        `SELECT * FROM users
        JOIN users_table ON users_table.id = user.user_id WHERE users = ${results.rows[0].users} `,
        (error, results) =>{
            if(err) {
             return res.status(400).json({
              status: 'error',
              message: 'Error unable to retrive user data', 
             });   
            }
        },
        res.json({
        status: 'success',
        data: {
            message: 'User successfully created',
            user_id: results.rows[0].user_id
        }
        })
        )
    }
    // await client.query(
    //     `SELECT user_id, firstname, lastname, email, FROM users
    //     JOIN users_table ON users_table.id = users.user_id WHERE users = ${results.rows[0].users} `,
    //     (error, results) =>{
    //         if(err) {
    //          return res.status(400).json({
    //           status: 'error',
    //           message: 'Error unable to retrive user data', 
    //          });   
    //         }
    //     },
    //     res.json({
    //     status: 'success',
    //     data: {
    //         message: 'Account successfully created',
    //         user_id: results.rows[0].user_id
    //     }
    //     })
    //     )