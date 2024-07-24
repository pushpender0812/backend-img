const mongoose = require("mongoose")


mongoose.connect("mongodb://localhost:27017/multiImage").then(() => {
    console.log("Mongodb Contected Successfully");
})
.catch((err) => {
    console.log(err);
})