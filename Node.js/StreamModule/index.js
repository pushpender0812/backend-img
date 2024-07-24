const fs = require('fs')
const http = require('http')
const { log } = require('util')

const server =  http.createServer()

server.on('request',(req,res) => {
    // fs.readFile("input.txt",(err,data) => {
    //     if(err) return console.log(err)
    //         res.end(data.toString())
    // })

    // 2nd Way
    // Reading From a Stream
    // Create a readable stream
    // Handle stream events -> data,end and error
    const rstream = fs.createReadStream("input.txt")

    // rstream.on("data",(chunkdata) => {
    //    res.write(chunkdata)
    // })
    // rstream.on("end",() => {
    //     res.end();
    // })
    // rstream.on("error",(err) => {
    // console.log(err);
    //     res.end("File not Found")
    // })

    // 3rd way
    rstream.pipe(res)

})

server.listen(8000,"127.0.0.1")