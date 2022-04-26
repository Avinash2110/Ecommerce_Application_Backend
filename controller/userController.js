const User = require("../model/user");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const mailHelper = require("../util/mailHelper");
const crypto = require("crypto");
const user = require("../model/user");

exports.registerUser = async (req, res) =>{
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({
            error: "Some fields are missing"
        })
    }

    let user;

    let result;

    try{
        if(!req.files){
            user = new User(req.body);
        }
        else{
            let file = req.files.photo;
            result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: "users",
                width: 250,
                crop: "scale"
            })

            if(!result){
                return res.status(400).json({
                    error: "Some issue with image"
                })
            }
            user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                photo: {
                    id: result.public_id,
                    secure_url: result.secure_url
                }
            })
        }
    }
    catch(err){
        if(Object.keys(err)==0){
            return res.status(400).json({
                error: "Some issue with image"
            })
        }
        const errorKeys = Object.keys(err.errors);
        return res.status(400).json({
            error: err.errors[errorKeys[0]].message
        })

    }

    try {
        let response = await user.save();
        if(!response){
            return res.status(400).json({
                error: "User Registration Failed"
            })
        }

        response.password = undefined;

        return res.json({
            message: "success",
            response
        })

    } catch (err) {
        if(Object.keys(err)==0){
            return res.status(400).json({
                error: "User Registration failed"
            })
        }

        if(!err.errors){
            return res.status(400).json({
                error: "Some issue occured or email already exists"
            })
        }

        const errorKeys = Object.keys(err.errors);
        return res.status(400).json({
            error: err.errors[errorKeys[0]].message
        })
    }
}

exports.login = async (req, res) =>{
    let {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            error: "Email or Password field is missing"
        })
    }

    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                error: "User does not exist"
            })
        }

        let isPasswordValid = await user.validatePassword(password);
        if(!isPasswordValid){
            return res.status(400).json({
                error: "Password does not match"
            })
        }

        const token = user.getJwtToken();
        const options = {
            expires: new Date(Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000),
            httpOnly: true
        }
        res.cookie("token", token, options);

        user.password = undefined;
        res.json({
            token,
            user
        })
        
    } catch (err) {
        if(Object.keys(err)==0){
            return res.status(400).json({
                error: "Some error occured"
            })
        }
        const errorKeys = Object.keys(err.errors);
        return res.status(400).json({
            error: err.errors[errorKeys[0]].message
        })
    }
}

exports.logout = (req, res) =>{
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.json({
        success: "true",
        message: "User logged out successfully"
    })
}

exports.forgotPassword = async (req, res) =>{
    const {email} = req.body;
    let user;
    if(!email){
        return res.status(400).json({
            error: "Email is required"
        })
    }

    try {
        
        user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                error: "User does not exist"
            })
        }

    } catch (err) {
        if(Object.keys(err)==0){
            return res.status(400).json({
                error: "Some error occured"
            })
        }
        const errorKeys = Object.keys(err.errors);
        return res.status(400).json({
            error: err.errors[errorKeys[0]].message
        })
    }

    const forgotToken = user.getForgotPasswordToken();

    try {
        const options = {
            email: email,
            subject: "Ecommerce Application: Password Reset Mail",
            text: `Please enter the token in the Reset password page. Token: ${forgotToken}`
        }

        let info = mailHelper(options);
        await user.save({validateBeforeSave: false});

        return res.json({
            success: true,
            message: "Email sent successfully",
            info
        })
    } catch (err) {

        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save({validateBeforeSave: false});

        return res.status(400).json({
            error: "Not able to send email to the user"
        })
    }

}

exports.resetPassword = async (req, res) =>{
    let token = req.body.token;
    let forgotPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    try {
        
        let user = await User.findOne({
            forgotPasswordToken,
            forgotPasswordExpiry: {$gt: Date.now()}
        })

        if(!user){
            return res.status(400).json({
                error: "Forgot password token invalid or expired"
            })
        }

        if(!req.body.password || !req.body.confirmPassword){
            return res.status(400).json({
                error: "Password and Confirm password required"
            })
        }

        if(req.body.password !== req.body.confirmPassword){
            return res.status(400).json({
                error: "Password and Confirm Password does not match"
            })
        }

        user.password = req.body.password;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;

        await user.save();

        return res.json({
            success: true,
            message: "Password changed successfully",
            user
        })

    } catch (err) {
        if(Object.keys(err)==0){
            return res.status(400).json({
                error: "Some error occured"
            })
        }
        const errorKeys = Object.keys(err.errors);
        return res.status(400).json({
            error: err.errors[errorKeys[0]].message
        })
    }
}

exports.getUserDetails = (req, res) =>{
    const user = req.user;

    user.password = undefined;

    return res.json(user);
}

exports.changePassword = async (req, res) =>{
    const userId = req.user.id;
    try {
        let user = await User.findById(userId);
        if(!req.body.oldPassword || !req.body.password){
            return res.status(400).json({
                error: "Old password and new password are required"
            })
        }
        if(!user.validatePassword(req.body.oldPassword)){
            return res.status(401).json({
                error: "Old password does not match with current password"
            })
        }

        user.password = req.body.password;
        const newUser = await user.save();
        newUser.password = undefined;
        return res.json({
            success: true,
            newUser
        })

    } catch (err) {
        if(Object.keys(err)==0){
            return res.status(400).json({
                error: "Some error occured"
            })
        }
        const errorKeys = Object.keys(err.errors);
        return res.status(400).json({
            error: err.errors[errorKeys[0]].message
        })
    }
}


