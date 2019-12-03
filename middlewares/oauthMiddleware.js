require('dotenv').config();


const jwt = require('jsonwebtoken');

// const jwtSecretKey = process.env.JWT_KEY;

const verifyToken = (req, res, next) => {
 
const authHeader = req.headers['authorization']
  
const token = authHeader && authHeader.split(' ')[1];

if (token === null || token === undefined) {
    
return res.status(401).json(token);
  
}
  
jwt.verify(token, (error, user) => {
    
if (error) return res.status(403).json({
    error: error
});
    
req.user = user;
    
next();
  
});

};

module.exports = verifyToken;
