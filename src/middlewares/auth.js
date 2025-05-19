const adminAuth = (req,res,next)=>{
    const token = "auv264";
    const isAdmin = token === "auv";
    if(!isAdmin){
        res.status(401).send("You are Unauthorised");
    }
    else{
        console.log("You are Authorised");
        next();
    }
}

module.exports = {adminAuth};