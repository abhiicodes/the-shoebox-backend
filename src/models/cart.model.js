const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    items:[{product_id:{type:mongoose.Schema.Types.ObjectId, ref:"mobile"},quantity:{type:Number},size:{type:Number}}],
    user_id:{type:mongoose.Schema.Types.ObjectId,ref:"user"}
})

module.exports= mongoose.model("cart",cartSchema)