const mongoose = require("mongoose")


const multiImageSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    images:[String]
})


const MultiImage = new mongoose.model("MultipleImage",multiImageSchema)

module.exports = MultiImage

