const mongoose = require("mongoose");

const dbConnect = () =>{
    mongoose.connect(process.env.DATABASE_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }).then(() =>{
        console.log("DB Connected")
    }).catch(() =>{
        console.log("DB Connection error");
        process.exit(1);
    })
}

module.exports = dbConnect;