const mongoose = require("mongoose");

const connectDB = async () =>{
   await mongoose.connect("mongodb+srv://umavenkateshandavarapu:ZPm9BJwazggFEp0m@namastenodejs.ibkqb7b.mongodb.net/devTinder")
}

module.exports = connectDB;