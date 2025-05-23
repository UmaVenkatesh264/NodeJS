const express = require("express");
const {connectDB} = require("./config/database")
const app = express();
const userModel = require("./models/user")
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

app.use(express.json())

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
app.get("/user", async (req,res)=>{
    const userEmail = req.body.emailId;
    try{
        const user = await userModel.find({emailId: userEmail});
        res.send(user);
    }
    catch(err){
        res.status(400).send("Not found");
    }
})

//DELETE
app.delete("/user", async (req,res)=>{
    const userId = req.body.userId;
    try{
        await userModel.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }
    catch(err){
        res.status(400).send("something went wrong");
    }
})

//UPDATE
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills" , "lastName"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (Array.isArray(data.skills) && data.skills.length > 10) {
    throw new Error("Skills cannot be more than 10");
    }
    const user = await userModel.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("UPDATE FAILED:" + err.message);
  }
});

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
