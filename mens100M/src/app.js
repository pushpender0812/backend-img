const express = require("express");
require("../src/db/conn")

const MensRanking = require("../src/models/mens")
const router = require("../src/routers/men")

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json())

app.use(router)

// we will handle post request








// app.get("/",async(req,res) => {
//     res.send("what up there is first tab")
// })

app.listen(port,() => {
    console.log(`connection is live at port no ${port}`);
})