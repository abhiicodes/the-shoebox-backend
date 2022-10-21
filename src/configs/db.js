const mongoose = require("mongoose");

module.exports = async ()=>{
   await mongoose.connect("mongodb+srv://abhi:abhi@shoebox.sjewgdn.mongodb.net/test")
}