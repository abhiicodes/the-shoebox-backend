const router = require("express").Router();

const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();
router.post("/orders", async (req, res) => {
  try {
    var instance = new Razorpay({
      key_id: process.env.RPAY_KEY,
      key_secret: process.env.RPAY_SECRET,
    });

    var options = {
      amount: 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };
    instance.orders.create(options, function (err, order) {
      if (err) {
        res.status(500).send("error");
      }
      res.send({ data: order });
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/verify", (req, res) => {
  try {
    let body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

    var expectedSignature = crypto
      .createHmac("sha256", process.env.RPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === req.body.razorpay_signature)
      res.send("Signature verififed");
    else res.status(500).send("invalid signature");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
