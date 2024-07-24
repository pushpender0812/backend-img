const express = require("express")
const router = new express.Router()
const Student = require("../models/students")



router.post("/students", async(req, res) => {
    try {
      const user = new Student(req.body);
  
      const createUser = await user.save();
      res.status(201).send(createUser);
    } catch (error) {
      res.status(400).send(e);
    }
  });
  
  // read the data of registered Students
  
  router.get("/students", async (req, res) => {
    try {
      const studentsData = await Student.find();
      res.send(studentsData);
    } catch (error) {
      res.send(error);
    }
  });
  
  // get the individual Student data using id
  
  router.get("/students/:id", async (req, res) => {
    try {
      const _id = req.params.id;
      // console.log(req.params);
      const studentData = await Student.findById(_id);
      console.log(studentData);
      if (!studentData) {
        return res.status(404).send();
      } else {
        res.send(studentData);
      }
  
      // res.send(studentData)
    } catch (error) {
      res.send(error);
    }
  });
  
  // update the students by it id
  
  router.patch("/students/:id", async (req, res) => {
    try {
      const _id = req.params.id;
      const updateStudents = await Student.findByIdAndUpdate(_id, req.body, {
        new: true,
      });
      res.send(updateStudents);
    } catch (error) {
      res.status(404).send(error);
    }
  });
  
  // find and update by name
  
  router.patch("/students/v1/:name", async (req, res) => {
    try {
      const name = req.params.name;
      console.log(name,"sdfb")
      const updateStudents = await Student.updateOne({name}, req.body, {
        new: true,
      });
      res.send(updateStudents);
    } catch (error) {
      res.status(404).send(error);
  
    }
  });
  
  // delete the students by its id
  
  router.delete('/students/:id',async(req,res) => {
      try {
          const _id = req.params.id;
       const deleteStudent  = await Student.findByIdAndDelete(_id)
       if (!_id) {
          return res.status(400).send();
       }
       res.send(deleteStudent)
      } catch (error) {
          res.status(500).send(error)
      }
  })

// 2. we need to define the router

// router.get('/pushpu',(req,res) => {
//     res.send("Hello whatsUp guys hry    ")
// })

module.exports = router;