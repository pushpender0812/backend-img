const express = require("express");
require("./db/conn");
const Student = require("./models/students");
const studentRouter = require("./routers/student")

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(studentRouter)
// create  a new students

// app.post('/students',(req,res) => {

//    const user = new Student(req.body)
// //    console.log(user);
//    user.save().then(() => {
//     res.status(201).send(user)
//    }).catch((e) => {
//     res.status(400).send(e)
//    })

// //    res.send("hello from the other side");
// })


// // 1. create  a new router 

// const router = new express.Router()


// // 2. we need to define the router

// router.get('/pushpu',(req,res) => {
//          res.send("Hello whatsUp guys")
// })

// 3. we need to register our router




// app.post("/students", async (req, res) => {
//   try {
//     const user = new Student(req.body);

//     const createUser = await user.save();
//     res.status(201).send(createUser);
//   } catch (error) {
//     res.status(400).send(e);
//   }
// });

// // read the data of registered Students

// app.get("/students", async (req, res) => {
//   try {
//     const studentsData = await Student.find();
//     res.send(studentsData);
//   } catch (error) {
//     res.send(error);
//   }
// });

// // get the individual Student data using id

// app.get("/students/:id", async (req, res) => {
//   try {
//     const _id = req.params.id;
//     // console.log(req.params);
//     const studentData = await Student.findById(_id);
//     console.log(studentData);
//     if (!studentData) {
//       return res.status(404).send();
//     } else {
//       res.send(studentData);
//     }

//     // res.send(studentData)
//   } catch (error) {
//     res.send(error);
//   }
// });

// // update the students by it id

// app.patch("/students/:id", async (req, res) => {
//   try {
//     const _id = req.params.id;
//     const updateStudents = await Student.findByIdAndUpdate({_id}, req.body, {
//       new: true,
//     });
//     res.send(updateStudents);
//   } catch (error) {
//     res.status(404).send(error);
//   }
// });

// // find and update by name

// app.patch("/students/v1/:name", async (req, res) => {
//   try {
//     const name = req.params.name;
//     console.log(name,"sdfb")
//     const updateStudents = await Student.updateOne({name}, req.body, {
//       new: true,
//     });
//     res.send(updateStudents);
//   } catch (error) {
//     res.status(404).send(error);

//   }
// });

// // delete the students by its id

// app.delete('/students/:id',async(req,res) => {
//     try {
//         const _id = req.params.id;
//      const deleteStudent  = await Student.findByIdAndDelete(_id)
//      if (!_id) {
//         return res.status(400).send();
//      }
//      res.send(deleteStudent)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

app.listen(port, () => {
  console.log(`connection is setup at ${port}`);
});
