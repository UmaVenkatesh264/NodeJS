const express = require("express");

const app = express();

app.use("/auv",(req,res)=>{
    res.send("Hello AUV")
})

app.use("/",(req,res)=>{
    res.send("Hello")
})

app.listen(3000, ()=>{
    console.log("server started");
    
})