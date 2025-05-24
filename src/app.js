const express = require("express");
const app = express();

const connectDB = require("./config/database")
const userModel = require("./models/user")
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth")

app.use(express.json())
app.use(cookieParser());

// POST 
app.post("/signUp", async (req,res)=>{
    // const userObj = {
    //     firstName : "Jasprit",
    //     lastName : "Bumrah",
    //     emailId : "jb93@gmail.com",
    //     password : "Sanjana@143"
    // }
    // console.log(req.body);

    try{
        // validation
        validateSignUpData(req);

        // encryption
        const {firstName, lastName, emailId, password} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new userModel({
          firstName, lastName, emailId, password:passwordHash
        });
        await user.save();
        res.send("used added successfully")
   }catch(err){
        res.status(400).send("Error: " + err.message)
   }
})

app.post("/login", async(req,res)=>{
  try{
    const {emailId, password} = req.body;

    if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid!");
    }

    const user = await userModel.findOne({emailId : emailId});
    if(!user){
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(isPasswordValid){
      // generating a token
      const token = await jwt.sign({_id : user._id}, "DEV@Tinder$264" , {expiresIn : "1d"});
      // wrapping it inside a cookie
      res.cookie("token", token, {expires: new Date(Date.now() + 24 * 3600000)});
      res.send("Login Successful")
    }
    else{
      throw new Error("Invalid Credentials");
    }

  }catch(err){
        res.status(400).send("Error: " + err.message)
   }
})

//GET
app.get("/profile", userAuth, async(req,res)=>{
    try{
      const user =  req.user;
      res.send(user);
    }
    catch(err){
        res.status(400).send("Error: " + err.message)
   }
})




connectDB()
.then(()=>{
    console.log("DB connection established");
    app.listen(7777, ()=>{
    console.log("server is successfully listening on port 7777");
})
})
.catch((err)=>{
    console.error("DB not connected");
})
