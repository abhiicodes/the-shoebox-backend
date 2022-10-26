const express = require("express");
const Mobile = require("../models/mobile.model");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const jwt = require("jsonwebtoken");
const categoryMiddleware = require("../middlewares/category.middleware");
require("dotenv").config();
const { uploadMultiple } = require("../middlewares/file.middleware");
const { uploadToCloudinary } = require("../middlewares/file.middleware");

router.post(
  "/mobiles",
  authMiddleware,
  categoryMiddleware,
  uploadMultiple("images"),
  async (req, res) => {
    try {
      //
      var imageUrlList = [];

      for (var i = 0; i < req.files.length; i++) {
        var locaFilePath = req.files[i].path;

        // Upload the local image to Cloudinary
        // and get image url as response
        var result = await uploadToCloudinary(locaFilePath);
        //
        imageUrlList.push(result.url);
      }

      // var response = buildSuccessMsg(imageUrlList);

      // return res.send(response);

      req.body.images = imageUrlList;

      const mobile = await Mobile.create(req.body);
      return res.send(mobile);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
);

router.get("/mobiles", authMiddleware, async (req, res) => {
  try {
    //
    const user_id = req.query.user;
    let mobile;
    if (!user_id) {
      mobile = await Mobile.find();
    } else {
      mobile = await Mobile.find({ user_id });
    }

    return res.send(mobile);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.get("/mobiles/:id", authMiddleware, async (req, res) => {
  try {
    //

    const mobile = await Mobile.findById(req.params.id).populate({
      path: "user_id",
    });

    return res.send(mobile);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});
router.patch(
  "/mobiles/:id",
  authMiddleware,
  categoryMiddleware,
  async (req, res) => {
    try {
      //

      const mobile = await Mobile.findById(req.params.id).lean().exec();
      //   const user_id = mobile.user_id.split("(")
      //
      if (mobile.user_id.toString() !== req.body.user_id)
        return res.status(401).send("unauthorized");
      const updatedMobile = await Mobile.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      return res.send(updatedMobile);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
);

router.delete(
  "/mobiles/:id",
  authMiddleware,
  categoryMiddleware,
  async (req, res) => {
    try {
      //

      const mobile = await Mobile.findById(req.params.id).lean().exec();
      //   const user_id = mobile.user_id.split("(")
      //
      if (mobile.user_id.toString() !== req.body.user_id)
        return res.status(401).send("unauthorized");
      const updatedMobile = await Mobile.findByIdAndDelete(req.params.id);

      return res.send(updatedMobile);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
);

module.exports = router;
