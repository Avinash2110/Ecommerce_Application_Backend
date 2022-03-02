const User = require("../model/user");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");

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
                width: 150,
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