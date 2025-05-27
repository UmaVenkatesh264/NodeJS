const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation")

profileRouter.get("/profile/view", userAuth, async(req,res)=>{
    try{
      const user =  req.user;
      res.send(user);
    }
    catch(err){
        res.status(400).send("Error: " + err.message)
   }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });   
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit/password", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const {password} = loggedInUser;

         const updatedPassword = req.body.password;

        const isPasswordValid = await bcrypt.compare(updatedPassword, password);

        if(isPasswordValid) {
            throw new Error("You are using existing password, please try other one")
        }

        const passwordHash = await bcrypt.hash(updatedPassword, 10);
        loggedInUser.password = passwordHash;

        await loggedInUser.save();

        res.send("Password Updated Successfully");

    }
    catch(err){
        res.status(400).send("ERROR :" + err.message);
    }
})

module.exports = profileRouter;