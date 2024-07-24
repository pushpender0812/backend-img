const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        },
    mobile:{
        type:Number
    }    
})

const User = new mongoose.model("User",userSchema)

module.exports = User;