const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user_id:{type: mongoose.Schema.Types.ObjectId, ref:"user"},
    items:[{product_id:{type:mongoose.Schema.Types.ObjectId, ref:"mobile"},quantity:{type:Number}}],
    cancelled:{type:Boolean,default:false},
    address:{type:String}

})

module.exports = mongoose.model("orders",orderSchema);

