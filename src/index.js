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
app.use(express.json());
app.use(cors());
app.use("/user", userController)
app.use("/categories", categoryController)
app.use("/cart",cartController)
app.use("/order",authMiddleware,categoryMiddleware,orderController)
app.listen(PORT, async()=>{
    try {
        connect();
        console.log(`Listenening to Port ${PORT}`)
    } catch (error) {
        console.log(error)
    }
})