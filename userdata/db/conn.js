const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/user")
.then(() => {
    console.log("Mongodb connected successfully");
})
.catch((e) => {
    console.log(e);
})