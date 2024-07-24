require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser");

require("./db/conn");
const Register = require("./models/registers");

const port = process.env.PORT || 8000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
const auth = require("./middleware/auth");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  res.render("index");
});

// For logout

app.get("/logout",auth,async(req,res) => {
  try {
    console.log(req.user);

   // for single device logOut

    // req.user.tokens = req.user.tokens.filter((tokenDoc) => tokenDoc.token !== req.token);

   // logout from all devices

   req.user.tokens = []

    res.clearCookie("jwt")
    console.log("logout Success");
   await req.user.save()
   res.render("login")
  } catch (error) {
    res.status(500).send(error)
  }
})

app.get("/secret", auth, (req, res) => {
  console.log(`this is the cookie awesome ${req.cookies.jwt}`);
  res.render("secret");
});

app.get("/register", (req, res) => {
  res.render("register");
});

// Create a new user in our database

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    if (password === cpassword) {
      const registerEmployee = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        age: req.body.age,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
      });
      console.log("the success part" + registerEmployee);

      const token = await registerEmployee.generateAuthToken();
      console.log("the token part"+ "   " + token);

      // The res.cookie() function is used to set the cookie name to value.
      // the value parameter may be a string or object converted to JSON

      //  res.cookie()
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 60000),
        httpOnly: true,
        // secure: true // Use secure cookies in production
      });

      const registered = await registerEmployee.save();
      res.status(201).render("index");
    } else {
      res.status(400).send("Confirm password is not matched");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});



// login check

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // console.log(`${email} and password is ${password}`);

    const useremail = await Register.findOne({ email: email });

    if (!useremail) {
      return res.status(400).send("Invalid login email.");
    }

    const isMatch = await bcrypt.compare(password, useremail.password);

    console.log(
      `the entered password is ${password} and the saved password is ${useremail.password}`
    );

    console.log(isMatch);

    // console.log("matched success");
    // console.log(await useremail.generateAuthToken());
    const token = await useremail.generateAuthToken();
    // console.log("matched success");
    console.log("the token part" + token);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 60000),
      httpOnly: true,
      // secure:true
    });
    console.log(`this is the cookie awesome ${req.cookies.jwt}`);

    if (isMatch) {
      res.status(201).render("index");
    } else {
      res.send("Invalid Password detail");
    }
  } catch (error) {
    res.status(400).send("Invalid LOGIN Email not valid");
  }
});

const jwt = require("jsonwebtoken");

const createToken = async () => {
  const token = jwt.sign(
    { _id: "667926dd4cb46b7d6e1df6bb" },
    "mynameispushpenderyadav",
    {
      expiresIn: "2 days",
    }
  );
  // console.log(token);

  const userVer = await jwt.verify(token, "mynameispushpenderyadav");
  console.log(userVer);
};

createToken();

// const bcrypt = require("bcryptjs");

// const securePassword = async(password) => {
//     const pawwordHash = await bcrypt.hash(password,10);
//     console.log(pawwordHash);

//     const passwordMatch = await bcrypt.compare(password,pawwordHash);
//     console.log(passwordMatch);
// }

// securePassword("Pushpu@12")

app.listen(port, () => {
  console.log(`Server is running at port no ${port}`);
});
