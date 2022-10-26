const userModel = require("../models/user.model");

module.exports = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    //
    if (user) return res.status(500).send("User already exists");
    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
};
