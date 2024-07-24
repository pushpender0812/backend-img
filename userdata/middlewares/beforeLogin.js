

const beforeLogin = async(req,res,next)=> {
    const token = req.cookies.jwt;
    if (token) {
        res.redirect("/profile");
    } else {
        next();
    }
}

module.exports = beforeLogin;