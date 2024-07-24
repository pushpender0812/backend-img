const http = require("http")
const fs = require('fs')

const server = http.createServer((req,res) => {

     const data = fs.readFileSync(`${__dirname}/userApi.json`,"utf-8")
        // res.end(data)
        const objdata = JSON.parse(data)
    



    // console.log(req.url);
    if (req.url == "/") {
        res.end("hello from Home page")
    } else if (req.url == "/about") {
        res.end("About page is here")
    }  else if (req.url == '/contact') {
        res.end("This is the contact Page")
    } else  if(req.url == '/userapi'){
        // fs.readFile(`${__dirname}/userApi.json`,"utf-8",(err,data) => {
        //     // res.end(data)
        //     const objData = JSON.parse(data);
        //     res.end(data)
        // })
        res.writeHead(200,{"content-type":"application/json"})
        res.end(objdata[2].title)
    }
    
    else{
        res.writeHead(404,{"content-type":"text/html"});
        res.end(("<h1>404 error pages.page does not exists in Pushpender Web App</h1>"))
    } 
    // res.end("Hello From the Server Side by pushpender yadav")
})

server.listen(8000,"127.0.0.1", () => {
    console.log("listining to the port no at 8000")
})