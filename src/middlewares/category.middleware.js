const jwt = require("jsonwebtoken");
require('dotenv').config()


module.exports = async (req,res,next)=>{
try {
    const token = req.headers.authorization.split(" ")[1];
    const {_id} = jwt.decode(token,process.env.JWT_SECRET_KEY)
    req.body.user_id = _id;
    next();
} catch (error) {
    res.status(500).send(error.message)
}
}