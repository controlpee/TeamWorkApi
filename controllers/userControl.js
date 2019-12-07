require('dotenv').config();

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');


const jwtKey = process.env.JWT_KEY;

const { Pool } = require('pg');


const pool = new Pool({
        host: process.env.DB_HOST,
            
        user: process.env.DB_USER,
            
        password: process.env.DB_PASS,
            
        database: process.env.DB_NAME,
            
        port: process.env.DB_PORT
});


const signIn = async (req, res) => {
    
const { email } = req.body;
    
const { password } = req.body;
    
if (
 email === '' ||
 email === undefined ||
 password === '' || password === undefined
 ) {
        return res.status(400).json({
            
message: 'request body is invalid'
        
});
    
}
    
await pool.query(
`SELECT * FROM users WHERE email = '${req.body.email}'`,

(err, result) => {
            
if (err || result.rows === '' || result.rowCount === 0) {
                
return res.status(404).json({ 
status: 'error', 
message: 'user not found' 
});
            
}

            
const savedPassword = result.rows[0].password;
            
bcrypt.compare(req.body.password, savedPassword).then(pass => {
                
if (!pass) {
                    
return res.status(403).json({ 
status: 'failed', 
message: 'invalid credentials' 
});
                
}

                
const user = {
                    
user_id: result.rows[0].id,
                    
jobrole: result.rows[0].jobrole
                
};

                
const token = jwt.sign(user, jwtKey);

                
const validUser = {
                    
status: 'success',
                    
data: {
                        
token,
                        
userId: result.rows[0].id,
                        
firstname: result.rows[0].firstname,
                        
lastname: result.rows[0].lastname,
                        
email: result.rows[0].email,
                        
gender: result.rows[0].gender,
                        
jobrole: result.rows[0].jobrole,
                        
department: result.rows[0].department,
                        
address: result.rows[0].address
                    
}
                
};
                
res.status(200).json(validUser);
                
res.end();
            
});
        
}
    
);

};


const signUp = async (req, res) => {
    
const salt = await bcrypt.genSalt(10);
    
const hashedPassword = await bcrypt.hash(req.body.password, salt);

    
const { firstname } = req.body;
    
const { lastname } = req.body;
    
const { email } = req.body;
    
const password = hashedPassword;
    
const { gender } = req.body;
    
const { jobrole } = req.body;
    
const { department } = req.body;
    
const { address } = req.body;

    
await pool.query(
'INSERT INTO users(firstname, lastname, email, password, gender, jobRole, department, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        
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
                
return res.status(403).json(err.detail);
            
}

            
const newUser = {
                
status: 'success',
                
data: {
                    
message: 'User account successfully created',
                    
token: req.cookies.token,
                    
userId: result.rows[0].id,
                    
email: result.rows[0].email
                
}
            
};
            
res.json(newUser);
        
}
    
);

};


module.exports = {
    
signIn,

signUp
  
};
