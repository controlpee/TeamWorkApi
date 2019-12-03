require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
// const jwtKey = process.env.JWT_KEY;


const client = new Client({
 host: process.env.DB_HOST,
 user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});


exports.loginUser = async (req, res) => {
    
const { email, password } = req.body;
    
if ( email === '' || email === undefined || password === '' || password === undefined ) {
    return res.status(400).json({
        status: 'error',
        message: 'request body is invalid'
        
});
    
}
    
await client.query(`SELECT * FROM users WHERE email = ${req.body.email}`,

(error, result) => {
            
if (error || result.rows === '' || result.rowCount === 0) {
                
return res.status(404).json({ 
status: 'error', 
message: 'user not found' 
});
            
}

            
const savedPassword = result.rows[0].password;
            
bcrypt.compare(req.body.password, savedPassword).then(
    (valid) => {
                
if (!valid) {
                    
return res.status(401).json({ 
status: 'failed', 
message: new Error('Incorrect password!') 
});
                
}
               
const user = {
                    
userId: result.rows[0].id,
                    
jobRole: result.rows[0].jobrole
                
};

                
const token = jwt.sign(
     { userId: user_id }, 
    'RANDOM_TOKEN_SECRET',
    { expiresIn: '24h' });
                
const validUser = {
                    
status: 'success',
                    
data: [
    {
                        
token,
                        
userId: result.rows[0].id,
                        
firstname: result.rows[0].firstname,
                        
lastname: result.rows[0].lastname,
                        
email: result.rows[0].email,
                        
gender: result.rows[0].gender,
                        
jobRole: result.rows[0].jobrole,
                        
department: result.rows[0].department,
                        
address: result.rows[0].address
                    
}
]               
};
              
res.status(200).json(validUser);
                
res.end();
            
});
        
});

};


exports.registerUser = async (req, res) => {
    
const salt = await bcrypt.genSalt(10);
    
const hashedPassword = await bcrypt.hash(req.body.password, salt);

const { firstname, lastname, email, gender, jobrole, department, address } = req.body;
const password = hashedPassword;

    
await client.query(
`INSERT INTO users(firstname, lastname, email, password, gender, jobrole, department, address)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        
[
 firstname,
 lastname,
 email,
 password,
 gender,
 jobrole,
 department,
 address
 ],

async (err, result) => {
            
if (error) {
                
return res.status(500).json(error);
            
}

            
const newUser = {
                
status: 'success',
                
data: [
    {
                    
message: 'User account successfully created',
                    
token: req.cookies.token,
                    
userId: result.rows[0].id,
                    
email: result.rows[0].email                                                                                                                                                                                                      
                
}
]            
};
            
res.json(newUser);
        
}
    
);

};


// module.exports = {
    
// signIn,

// signUp
  
// };
