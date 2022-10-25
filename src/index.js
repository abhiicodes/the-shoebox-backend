const express = require("express");
const app = express();
const cors = require("cors");
const connect = require("./configs/db");
require('dotenv').config()
const PORT = process.env.PORT || 8080;
const userController = require("./controllers/user.controller")
const categoryController = require("./controllers/category.controller");
const cartController = require("./controllers/cart.controller")
const orderController = require("./controllers/order.controller");
const authMiddleware = require("./middlewares/auth.middleware");
const categoryMiddleware = require("./middlewares/category.middleware");
const paymentRoutes = require("./routes/payment")



app.use(express.json());
app.use(cors());


// var instance = new Razorpay({
//     key_id: process.env.RPAY_KEY,
//     key_secret: process.env.RPAY_SECRET,
//   });


//   app.use("/payment", async(req,res)=>{
//     var options = {
//         amount: 50,  
//         currency: "INR",
//         receipt: "orderrcptid_11"
//       };
//       instance.orders.create(options, function(err, order) {
//         console.log(order);
//         res.send({orderId:order.id})
//       });
//   })
  


app.use("/user", userController)
app.use("/categories", categoryController)
app.use("/cart",cartController)
app.use("/order",authMiddleware,categoryMiddleware,orderController)
app.use("/api/payment", paymentRoutes)
  

app.listen(PORT, async()=>{
    try {
        connect();
        console.log(`Listenening to Port ${PORT}`)
    } catch (error) {
        console.log(error)
    }
})