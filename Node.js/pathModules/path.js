const path = require("path")


console.log(path.dirname('D:/img projects/Node.js/pathModules/path.js'));   
console.log(path.extname('D:/img projects/Node.js/pathModules/path.js'));   
console.log(path.basename('D:/img projects/Node.js/pathModules/path.js'));   
const myPath =  path.parse('D:/img projects/Node.js/pathModules/path.js')  
console.log(myPath.root);