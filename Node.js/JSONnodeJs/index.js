const { channel } = require("diagnostics_channel");

const bioData = {
    name : "vinod",
    age : 26,
    channel:"technical"
}
// console.log(bioData);

const jsonDta = JSON.stringify(bioData)
// console.log(jsonDta);

const fs = require('fs');
const { json } = require("stream/consumers");
fs.writeFile("json1.json",jsonDta,() => {
    console.log("done");
})