const express = require("express");
const {connectDB} = require("./config/database")
const app = express();
const userModel = require("./models/user")

app.use(express.json())

app.post("/signUp", async (req,res)=>{
    // const userObj = {
    //     firstName : "Jasprit",
    //     lastName : "Bumrah",
    //     emailId : "jb93@gmail.com",
    //     password : "Sanjana@143"
    // }
    console.log(req.body);
    
    const user = new userModel(req.body);
   try{
        await user.save();
        res.send("used added successfully")
   }catch(err){
        res.status(400).send("Error: " + err.message)
   }
})

connectDB()
.then(()=>{
    console.log("DB connected");
    app.listen(7777, ()=>{
    console.log("server started");
})
})
.catch((err)=>{
    console.error("DB not connected");
})
