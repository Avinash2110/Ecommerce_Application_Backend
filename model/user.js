const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: [validator.isEmail, "Invalid Email Address"]
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    photo: {
        id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    forgotPasswordToken:{
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

userSchema.methods.validatePassword = async function(userPassword){
    return await bcrypt.compare(userPassword, this.password);
}

userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

userSchema.methods.getForgotPasswordToken = function(){
    let forgotToken = crypto.randomBytes(20).toString("hex");
    this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex');

    this.forgotPasswordExpiry = Date.now() + 20*60*1000;
    
    return forgotToken;
}

module.exports = mongoose.model("User", userSchema);