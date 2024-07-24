const express = require("express")

const router = new express.Router()
const MensRanking = require("../models/mens")

router.post("/mens",async(req,res) => {
    try {
      const addingMensRecords = new MensRanking(req.body)
      console.log(req.body);
      const insertMens =  await addingMensRecords.save()
      res.status(201).send(insertMens)
    } catch (error) {
      res.status(400).send(error)
    }
  })
  
  
  router.get("/mens",async(req,res) => {
      try {
       const getMens = await MensRanking.find({})
        res.status(201).send(getMens)
      } catch (error) {
        res.status(400).send(error)
      }
    })
  
    // We will handle get request individualy
  
    router.get("/mens/:id",async(req,res) => {
      try {
          const _id = req.params.id;
       const getMens = await MensRanking.findById(_id)
        res.status(201).send(getMens)
      } catch (error) {
        res.status(400).send(error)
      }
    })
  
  
    // We will handle PAtch request of individualy
  
    router.patch("/mens/:id",async(req,res) => {
      try {
          const _id = req.params.id;
       const getMens = await MensRanking.findByIdAndUpdate(_id,req.body)
        res.status(201).send(getMens)
      } catch (error) {
        res.status(500).send(error)
      }
    })
  
  
  // We will handle delete request of individualy
  
  router.delete("/mens/:id",async(req,res) => {
    try {
        const _id = req.params.id;
     const getMens = await MensRanking.findByIdAndDelete(_id)
      res.send(getMens)
    } catch (error) {
      res.status(500).send(error)
    }
  })
  

  module.exports = router;