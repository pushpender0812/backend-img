const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const employeSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        
    },
    lastname:{
        type:String,
        required:true,
        
    },
    email:{
        type:String,
        required:true,
        unique:true
        
    },
    gender:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
    },
    age:{
        type:Number,
        required:true,
        
    },
    password:{
        type:String,
        required:true,
    
    },
    confirmpassword:{
        type:String,
        required:true,
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]

})

// Method to generate authentication token

employeSchema.methods.generateAuthToken = async function(){
    try {
        // console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
        // console.log(process.env.SECRET_KEY);
        // console.log("test token :",token);
        this.tokens = this.tokens.concat({token})
        // console.log(this.tokens);   
        await this.save();
        return token;
    } catch (error) {
        res.send("the error part" + error)
        console.log("the error part" + error)
    }
}


// converting password into hash

employeSchema.pre("save",async function(next) {

  if (this.isModified("password")) {
   
  
    this.password = await bcrypt.hash(this.password,10);
    

    this.confirmpassword = this.password;
  }


    
    next()
})

// creating collection

const Register = new mongoose.model("Register",employeSchema)

module.exports = Register;