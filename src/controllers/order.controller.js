const express = require("express");
const cartModel = require("../models/cart.model");
const Order = require("../models/order.model");

const router = express.Router();

router.post("", async (req, res) => {
  try {
   
    const cart = await cartModel.findOne({ user_id:req.body.user_id });
    req.body.items = cart.items;

    const order = await Order.create(req.body);
    res.send(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.patch("/cancel/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { cancelled: true },
      { new: true }
    );
    res.send(order);
    
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
