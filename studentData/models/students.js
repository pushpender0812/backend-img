const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")


const Stusentdata = new mongoose.Schema({
   name :{
    type:String,
    require:true,
    min:3
   },
   fathername:{
    type:String,
    require:true,
    min:3
   },
   phone:{
    type:Number,
    require:true,

   },
   email:{
    type:String,
    required:true,
   },
   password:{
    type:String,
    required:true
   },
   profileImage: {
    data: Buffer,
    contentType: String
 },
   confirmPassword:{
    type:String,
    require:true
   }
})


Stusentdata.pre("save",async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password,10);

        this.confirmPassword = this.password
    }
    next()
})

const Student = new mongoose.model("Student",Stusentdata)

module.exports = Student;