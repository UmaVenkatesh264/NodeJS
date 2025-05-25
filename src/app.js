const express = require("express");
const app = express();

const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");

app.use("/", authRouter);
app.use("/", profileRouter);

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
