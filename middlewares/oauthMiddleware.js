require('dotenv').config();


const jwt = require('jsonwebtoken');


const jwtSecretKey = process.env.JWT_KEY;


const verifyToken = (req, res, next) => {
 
const authHeader = req.headers['authorization']
  
const token = authHeader && authHeader.split(' ')[1];

  
if (token === null || token === undefined) {
    
return res.sendStatus(401).json(token);
  
}
  
jwt.verify(token, jwtSecretKey, (err, user) => {
    
if (err) return res.sendStatus(403);
    
req.user = user;
    
next();
  
});

};

module.exports = {
  verifyToken,
};
