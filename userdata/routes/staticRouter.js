const express = require("express")
const beforeLogin = require("../middlewares/beforeLogin")

const router = express.Router()

router.get("/",(req,res) => {
    return res.render("home")
})

router.get("/login",beforeLogin,(req,res) => {
    return res.render("login")
})

// router.get("/profile",(req,res) => {
//     try {
//         res.render("profile")
//     } catch (error) {
//         res.send(error)
//     }
    
// })

// router.get("/register",(req,res) => {
//     return res.render("register")
// })

module.exports = router;