const express = require("express");

const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const categoryMiddleware = require("../middlewares/category.middleware");

const Cart = require("../models/cart.model");

require("dotenv").config();

router.post(
  "/add",
  authMiddleware,
  categoryMiddleware,

  async (req, res) => {
    try {
      const cart = await Cart.findOne({ user_id: req.body.user_id });
      console.log(cart,req.body)
      cart.items = [...cart.items, req.body];
      console.log(cart)
      // console.log(cart, req.body)

      const updatedCart = await Cart.findByIdAndUpdate(cart._id, cart, {
        new: true,
      });
      res.send(updatedCart);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
);


router.patch(
    "/edit",
    authMiddleware,
    categoryMiddleware,
  
    async (req, res) => {
      try {
        const cart = await Cart.findOne({ user_id: req.body.user_id });
        cart.items = cart.items.map((el)=>el.product_id.toString()===req.body.product_id?{...el,quantity:req.body.quantity}:el)
        // console.log(cart, req.body)
  
        const updatedCart = await Cart.findByIdAndUpdate(cart._id, cart, {
          new: true,
        });
        res.send(updatedCart);
      } catch (error) {
        return res.status(500).send(error.message);
      }
    }
  );


  router.get(
    "",
    authMiddleware,
    categoryMiddleware,
  
    async (req, res) => {
      try {
        const cart = await Cart.findOne({ user_id: req.body.user_id }).populate({ 
            path: 'items',
            populate: {
              path: 'product_id',
              
            } 
         })
       
        // console.log(cart, req.body)
  
        
        res.send(cart);
      } catch (error) {
        return res.status(500).send(error.message);
      }
    }
  );


  router.delete(
    "/delete/:id",
    authMiddleware,
    categoryMiddleware,
  
    async (req, res) => {
      try {
        const cart = await Cart.findOne({ user_id: req.body.user_id })
       
        // console.log(cart, req.body)

        cart.items = cart.items.filter((el)=>el.product_id.toString()!=req.params.id)
        // console.log(cart, req.body)
  
        const updatedCart = await Cart.findByIdAndUpdate(cart._id, cart, {
          new: true,
        });
       return res.send(updatedCart);
  
        
       
      } catch (error) {
        return res.status(500).send(error.message);
      }
    }
  );

  router.post("/set",authMiddleware,
  categoryMiddleware,async(req,res)=>{
    try {
      const cart = await Cart.findOne({ user_id: req.body.user_id })
      cart.items = req.body.items
      const updatedCart = await Cart.findByIdAndUpdate(cart._id, cart, {
        new: true,
      });
     return res.send(updatedCart);
    } catch (error) {
      res.status(500).send(error.message)
    }
  } )

module.exports = router;
