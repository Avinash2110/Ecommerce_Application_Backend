require("dotenv").config();
const app = require("./app");
const cloudinary = require('cloudinary');
const dbConnect = require("./config/dbConfig");

//DB Connection
dbConnect();

//Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
})

app.listen(process.env.PORT, () =>{
    console.log(`App is running at port ${process.env.PORT}`);
})