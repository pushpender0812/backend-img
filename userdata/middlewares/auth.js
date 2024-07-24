const jwt = require("jsonwebtoken")
const User = require("../models/students")

const auth = async(req,res,next) => {
    try {
        const token = req.cookies.jwt;
        if (token) {
            const verifyUser = jwt.verify(token,process.env.SECRET_KEY)
            console.log(verifyUser);
            const Userdata = await User.findOne({_id:verifyUser._id})
            console.log(Userdata);
    
            req.token = token
            req.user = Userdata
    
            next()
        } else {
            res.redirect("/login")
        }
       
    } catch (error) {
        res.redirect("/login")
    }
}

module.exports = auth;
