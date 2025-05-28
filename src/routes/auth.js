const express = require("express");
const authRouter = express.Router();

const UserModel = require("../models/user")
const {validateSignUpData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

authRouter.post("/signUp", async (req,res)=>{
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

        const user = new UserModel({
          firstName, lastName, emailId, password:passwordHash
        });
        await user.save();
        res.send("used added successfully")
   }catch(err){
        res.status(400).send("Error: " + err.message)
   }
})

authRouter.post("/login", async (req,res)=>{
  try{
    const {emailId, password} = req.body;

    if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid!");
    }

    const user = await UserModel.findOne({emailId : emailId});
    if(!user){
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if(isPasswordValid){
      // generating a token
      const token = await user.getJWT();
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

authRouter.post("/logout", async (req,res)=>{
    res.cookie("token", null, { expires : new Date(Date.now())});
    res.send("User Logged Out");
})

module.exports = authRouter;
