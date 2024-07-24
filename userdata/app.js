    require("dotenv").config();
    const express = require("express")
    require("./db/conn")
    const path = require('path')
    const ejs = require("ejs")
    const partials_path = path.join(__dirname,"./partials")
    const staticRoute = require('./routes/staticRouter')
    const User = require("./models/students")    
    const bcrypt = require("bcryptjs")
    const app = express()
    const multer = require("multer")
    const cookieParser = require("cookie-parser")
    const jwt = require("jsonwebtoken")
    const authMiddleware = require("./middlewares/auth")
    const beforeLogin = require("./middlewares/beforeLogin")

    app.use('/uploads', express.static('uploads'));
    app.use(express.json())
    app.use(cookieParser())
    app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded form data
    const port = process.env.PORT || 8000

    // Multer configuration
    // Storage engine setup
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            return cb(null, './uploads')
        },
        filename: function (req, file, cb) {
            return cb(null, `${Date.now()}-${file.originalname}`)
        }
    })
    // File type filtering
    const fileFilter = function (req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG and PNG files are allowed!'), false);
        }
    }
    //middleware for upload file
    const upload = multer({ storage: storage, fileFilter: fileFilter })

    app.set("view engine","ejs")
    app.set('views',path.resolve("./views"))
    app.use('/',staticRoute)

    app.get("/register",beforeLogin,(req,res) => {
        res.render("register")
    })

    app.post("/register",beforeLogin,upload.single('profileImage'), async(req,res) => {
        try {
            // const user = new User(req.body);
            // const createUser = await user.save();
            // res.status(201).json({message:"user create successfully",result:createUser})

            const password = req.body.password
            const cpassword = req.body.confirmPassword
            console.log(`the password is ${password} and confirmPAssword is ${cpassword}`);



            if (password === cpassword) {

                const profileImage = req.file.filename;

                const registerUser = new User({
                    name:req.body.name,
                    fathername:req.body.fathername,
                    phone:req.body.phone,
                    email:req.body.email,
                    profileImage,
                    password:req.body.password,
                    confirmPassword:req.body.confirmPassword,
                    
                })
                console.log("the success" + registerUser);

            
            // console.log("The token part" + "  " + token);

            // registerUser.tokens = registerUser.tokens.concat({ token})


            // res.cookie("jwt",token,{
            //     expires:new Date(Date.now() + 60000),
            //     httpOnly:true,
            // })

             await registerUser.save()
                res.status(201).render("login")
            } else {
                res.status(404).json("Confirm Password does not match to password")
            }

        } catch (error) {
            res.status(400).json(error)
        }
    })

    app.post("/login",beforeLogin, async(req,res) => {
        try {
            const email = req.body.email
            const password = req.body.password
            console.log(`The entered password is ${password} and email is ${email}`);

        const useremmail = await User.findOne({email:email})
        // console.log(useremmail);

        // if (!useremmail) {
        //     return res.status(400).send("This email is not registered yet")
        // }

        const isMatched = await bcrypt.compare(password,useremmail.password);
        console.log(isMatched);

            console.log(process.env.SECRET_KEY);
        const token = await jwt.sign({_id:useremmail._id.toString()},process.env.SECRET_KEY)


        res.cookie("jwt",token,{
            httpOnly:true,
        })
        console.log(req.cookies.jwt);

        if (isMatched) {
            res.status(201).render("home",{user:useremmail})
        } else {
            res.json("Invalid Email or Password")
        }

        } catch (error) {
            res.status(400).json(error)
        }
    })

    
    
app.get("/logout",authMiddleware,async(req,res) => {
    try {
    //    const deleteCookie = await req.cookies.delete()
    res.clearCookie("jwt")
    console.log("Logout Success");
       res.redirect("/login")
    //    console.log(deleteCookie);
      
    } catch (error) {
        res.send(error)
    }
})

  app.get("/profile",authMiddleware, async(req,res) => {
    try {
       console.log(req.user);
       res.render('profile',{user:req.user})
        
    } catch (error) {
        res.send(error)
    }
    
  })



    app.get("/Users",async (req,res) => {
        try {
            const UserData = await User.find()
            res.json({message:"All users fetched Successfully",result:UserData})
            // return res.render('home')
            console.log(UserData);
        } catch (error) {
            res.status(400).json(e)
        }
    })

    app.get("/Users/:id",async(req,res) => {
        try {
            const _id = req.params.id;
            const UserData = await User.findById(_id)
            console.log(UserData)
            if (!UserData) {
                return res.status(404).json();
            } else {
                    res.json({message:"User fetched Successfully",result:UserData})
                }
            
        } catch (error) {
            res.json(error)
        }
    })

    app.patch("/Users/:id",async (req,res) => {
        try {
            const _id = req.params.id;
            const updateUsers = await User.findByIdAndUpdate(_id,req.body,{
                new:true,   
            })
            res.json({message:"user Updated Successfully",result:updateUsers})
        } catch (error) {
            res.json(error)
        }
    })

    app.delete("/Users/:id",async(req,res) => {
        try {
            const _id = req.params.id;
            const deleteUsers = await User.findByIdAndDelete(_id)
            if (! _id) {
                return res.status(400).json()
            }
            re.json({message:"user deletd Successfully",result:deleteUsers})
        } catch (error) {
            res.json(error)
        }
    })

    app.listen(port,() => {
        console.log(`Server started successfully at port ${port}`);
    })