const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email should be unique"]
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    forPasswordToken:{
        type: String
    },
    forgotPasswordExpiry:{
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.validatePassword = function(userPassword){
    return bcrypt.compare(this.password, userPassword);
}



module.exports = mongoose.model("User", userSchema);