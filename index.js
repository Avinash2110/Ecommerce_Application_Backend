require("dotenv").config();
const app = require("./app");
const dbConnect = require("./config/dbConfig");

//DB Connection
dbConnect();

app.listen(process.env.PORT, () =>{
    console.log(`App is running at port ${process.env.PORT}`);
})