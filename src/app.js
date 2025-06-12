const express = require("express");
const app = express();

const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../swagger");

app.use(cors({
    origin : "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
