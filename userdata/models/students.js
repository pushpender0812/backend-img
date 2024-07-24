const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const userdataSchema = new mongoose.Schema({
   name :{
    type:String,
    require:true,
    min:3
   },
//    fathername:{
//     type:String,
//     require:true,
//     min:3
//    },
   phone:{
    type:Number,
    require:true,

   },
   email:{
    type:String,
    required:true,
    unique:true,
   },
   password:{
    type:String,
    required:true
   },
   profileImage: {

    type: String,
    required:true
 },
   confirmPassword:{
    type:String,
    require:true
   },
  
})


// userdataSchema.methods.generateAuthToken = async function(){
//     try {
//         const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
//         this.tokens = this.tokens.concat({token})

//         await this.save();
//         return token;
        
//     } catch (error) {
//         res.send("the error is " + error)
//         console.log("the error is " + error)
//     }
// }





userdataSchema.pre("save",async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password,10);

        this.confirmPassword = this.password
    }
    next()
})

const User = new mongoose.model("User",userdataSchema)

module.exports = User;