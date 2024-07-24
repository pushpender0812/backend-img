const { log } = require("console")
const fs = require("fs")

// fs.writeFileSync("read.txt","Hy There !!!")
// fs.writeFileSync("read.txt"," Pushpender Hy There !!!")

// fs.appendFileSync("read.txt","How is Going")

// fs.writeFileSync("bio.txt","Helo Write Complete Bio here")
// fs.appendFileSync("bio.txt","Some More Data Is Here")

// const bio = fs.readFileSync("bio.txt")
// console.log(bio.toString())/

// fs.renameSync("bio.txt","newBio.txt")

// fs.mkdirSync("Yadav")

// const data = fs.readFileSync('newBio.txt',"utf8")
// console.log(data);

fs.unlinkSync("newBio.txt")

// Node.js include an additional DataType called Buffer.
// (not available in browser's Javascript).
// Buffer is mainly used to Store Binary data,
// While Reading From a file or Recieving Packets over the network


// const buf_data = fs.readFileSync("read.txt")
// console.log(buf_data.toString())

// fs.renameSync("read.txt","newRead.txt")


