const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/registrtionData")
.then(() => {
    console.log("MongoDb connected successfully");
}).catch((err) => {
  console.log(err);
})