const express = require("express")

const path = require("path")

const app = express()
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 8000

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/",(req,res) => {
    res.render('data')
})