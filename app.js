const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

//importing routes
const userRoute = require("./route/userRoute");

//middleware injection to use json income request and cookie parser
app.use(express.json());
app.use(cookieParser());

//using routes middlware
app.use("/", userRoute);



module.exports = app;