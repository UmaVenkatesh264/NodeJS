const jwt = require("jsonwebtoken");
const UserModel = require("../models/user")

const userAuth = async(req,res,next)=>{
    try{
        const cookies = req.cookies;
        const {token} = cookies;

        if(!token){
            return res.status(401).send("Please Login !!")
        }

        const decodedObj = await jwt.verify(token, "DEV@Tinder$264");
        const {_id} = decodedObj;
        const user = await UserModel.findById(_id);

        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        next();
        }
    catch(err){
        res.status(400).send("ERROR :" + err.message);
    }
}

module.exports = {userAuth};