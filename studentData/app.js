const express = require("express")
require("./db/conn")
const path = require('path')
const ejs = require("ejs")
const partials_path = path.join(__dirname,"./partials")
const staticRoute = require('./routes/staticRouter')
const Student = require("./models/students")    
const bcrypt = require("bcryptjs")
const app = express()
const multer = require("multer")
app.use(express.json())
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded form data
const port = process.env.PORT || 8000

// Multer configuration
const storage = multer.memoryStorage(); // Store file in memory as a Buffer
const upload = multer({ storage: storage });

app.set("view engine","ejs")
app.set('views',path.resolve("./views"))
app.use('/',staticRoute)

app.get("/register",(req,res) => {
    res.render("register")
})

app.post("/register",upload.single('profileImage'), async(req,res) => {
    try {
        // const user = new Student(req.body);
        // const createUser = await user.save();
        // res.status(201).json({message:"user create successfully",result:createUser})

        const password = req.body.password
        const cpassword = req.body.confirmPassword
        console.log(`the password is ${password} and confirmPAssword is ${cpassword}`);



        if (password === cpassword) {

            const profileImage = {
                data: req.file.buffer,
                contentType: req.file.mimetype
              };

            const registerStudent = new Student({
                name:req.body.name,
                fathername:req.body.fathername,
                phone:req.body.phone,
                email:req.body.email,
                profileImage,
                password:req.body.password,
                confirmPassword:req.body.confirmPassword,
            })
            console.log("the success" + registerStudent);
            const registerred = await registerStudent.save()
            res.status(201).render("home",{user:registerStudent})
        } else {
            res.status(404).json("Confirm Password does not match to password")
        }

    } catch (error) {
        res.status(400).json(error)
    }
})

app.post("/login", async(req,res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        console.log(`The entered password is ${password} and email is ${email}`);

    const useremmail = await Student.findOne({email:email})
    // console.log(useremmail);

    // if (!useremmail) {
    //     return res.status(400).send("This email is not registered yet")
    // }

    const isMatched = await bcrypt.compare(password,useremmail.password);
    console.log(isMatched);

    if (isMatched) {
        res.status(201).render("home",{user:useremmail})
    } else {
        res.json("Invalid Email or Password")
    }

    } catch (error) {
        res.status(400).json(error)
    }
})
 
app.get("/students",async (req,res) => {
    try {
        const studentData = await Student.find()
        res.json({message:"All users fetched Successfully",result:studentData})
        // return res.render('home')
        console.log(studentData);
    } catch (error) {
        res.status(400).json(e)
    }
})

app.get("/students/:id",async(req,res) => {
    try {
        const _id = req.params.id;
        const studentData = await Student.findById(_id)
        console.log(studentData)
        if (!studentData) {
            return res.status(404).json();
        } else {
                res.json({message:"User fetched Successfully",result:studentData})
            }
        
    } catch (error) {
        res.json(error)
    }
})

app.patch("/students",async (req,res) => {
    try {
        const _id = req.params.id;
        const updateStudents = await Student.findByIdAndUpdate(_id,req.body,{
            new:true,   
        })
        res.json({message:"user Updated Successfully",result:updateStudents})
    } catch (error) {
        res.json(error)
    }
})

app.delete("/students/:id",async(req,res) => {
    try {
        const _id = req.params.id;
        const deleteStudents = await Student.findByIdAndDelete(_id)
        if (! _id) {
            return res.status(400).json()
        }
        res.json({message:"user deletd Successfully",result:deleteStudents})
    } catch (error) {
        res.json(error)
    }
})

app.listen(port,() => {
    console.log(`Server started successfully at port ${port}`);
})