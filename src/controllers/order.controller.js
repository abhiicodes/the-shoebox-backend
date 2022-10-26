const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const categoryMiddleware = require("../middlewares/category.middleware");
const cartModel = require("../models/cart.model");
const Order = require("../models/order.model");

const router = express.Router();

router.post("", async (req, res) => {
  try {
    const cart = await cartModel.findOne({ user_id: req.body.user_id });
    req.body.items = cart.items;

    const order = await Order.create(req.body);
    const newCart = await cartModel.findByIdAndUpdate(
      cart._id,
      { items: [] },
      { new: true }
    );
    res.send(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.patch("/cancel/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    const orders = await Order.find({ user_id: req.body.user_id }).populate({
      path: "items",
      populate: {
        path: "product_id",
      },
    });
    res.send(orders);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("", async (req, res) => {
  try {
    const order = await Order.find({ user_id: req.body.user_id }).populate({
      path: "items",
      populate: {
        path: "product_id",
      },
    });

    //

    res.send(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
