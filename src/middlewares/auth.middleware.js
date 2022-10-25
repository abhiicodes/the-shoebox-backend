const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  // console.log(req.headers);
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send("Unauthorized access");
  }
  try {
    const verification = jwt.verify(token, process.env.JWT_SECRET_KEY);

    next();
  } catch (error) {
    res.send(error.message);
  }
};
