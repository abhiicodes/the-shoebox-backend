const express = require("express");
const User = require("../models/user.model");
const OtpModel = require("../models/otp.model");
const authMiddleware = require("../middlewares/auth.middleware");
const jwt = require("jsonwebtoken");
const router = express.Router();
const argon2 = require("argon2");
require("dotenv").config();
const nodemailer = require("nodemailer");
const otpGenerator = require("../utils/otp.util");
const otpModel = require("../models/otp.model");
const Cart = require("../models/cart.model");
const userMiddleware = require("../middlewares/user.middleware");
const fs = require("fs");
const otpSender = require("../utils/otp");

router.get("", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/signup", userMiddleware, async (req, res) => {
  try {
    let { email, password } = req.body;
    //
    password = await argon2.hash(password);

    const user = await User.create({ email, password });
    const cart = await Cart.create({ user_id: user._id, items: [] });
    //
    const otp = otpGenerator();
    //
    const generatedOtp = await OtpModel.create({ user_id: user._id, otp });
    const msg = {
      from: process.env.GMAIL_ID,
      to: email,
      aubject: "OTP",
      html: otpSender(otp),
    };

    nodemailer
      .createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_ID,
          pass: process.env.GMAIL_PASS,
        },
        port: 465,
        host: "smtp.gmail.com",
      })
      .sendMail(msg, (err) => {
        if (err) return;

        return;
      });

    return res.send({
      message: "User created successfully",
      user_id: user._id,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(500).send("User does not exist or incorrect email");
    }
    if (await argon2.verify(user.password, req.body.password)) {
      const token = jwt.sign(
        { email: user.email, _id: user._id },
        process.env.JWT_SECRET_KEY
      );
      return res.send({ token, name: user.email });
    } else {
      return res.status(500).send("Invalid email or password");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.post("/verify/:id", async (req, res) => {
  try {
    const otp = await otpModel.findOne({ user_id: req.params.id });
    //
    if (req.body.otp == otp.otp) {
      const newOtp = await otpModel.findByIdAndUpdate(otp._id, { otp: null });
      return res.send("Verification successful");
    } else {
      return res.status(500).send("Incorrect otp");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/forgotpassword", async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email });

    const otp = otpGenerator();
    //
    const generatedOtp = await OtpModel.findOneAndUpdate(
      { user_id: user._id },
      { otp },
      { new: true }
    );
    const msg = {
      from: process.env.GMAIL_ID,
      to: email,
      aubject: "OTP",
      html: otpSender(otp),
    };

    nodemailer
      .createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_ID,
          pass: process.env.GMAIL_PASS,
        },
        port: 465,
        host: "smtp.gmail.com",
      })
      .sendMail(msg, (err) => {
        if (err) return;

        return;
      });

    return res.send({ user_id: user._id });
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/updatepassword/:id", async (req, res) => {
  try {
    const password = await argon2.hash(req.body.password);
    const user = await User.findByIdAndUpdate(req.params.id, { password });
    if (!user) {
      return res.status(500).send("User does not exist or incorrect email");
    }
    res.send("password update successfull");
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
