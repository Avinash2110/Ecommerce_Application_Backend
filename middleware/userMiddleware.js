const User = require("../model/user");
const jwt = require("jsonwebtoken");

exports.isSignedIn = async (req, res, next) =>{
    const token = req.header("Authorization");

    if(!token){
        return res.status(400).json({
            error: "You need to login first"
        })
    }
    const jwtToken = token.replace("Bearer ", "");
    const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);

    try {

        let user = await User.findById(decodedToken.id);
        if(!user){
            return res.status(400).json({
                error: "User does not exist"
            })
        }

        req.user = user;
        next();

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