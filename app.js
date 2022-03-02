const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const app = express();

//importing routes
const userRoute = require("./route/userRoute");

//express-file upload middleware
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))

//middleware injection to use json income request and cookie parser
app.use(express.json());
app.use(cookieParser());

//using routes middlware
app.use("/api/v1", userRoute);



module.exports = app;