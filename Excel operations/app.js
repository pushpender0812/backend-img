const express = require("express")
const xlsx = require("xlsx")
const path = require("path")

const app = express()
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 8000

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/",(req,res) => {
    res.render('data')
})

app.get("/read",(req,res) => {
    const filePath  = path.resolve(__dirname,'output.xlsx');
    const workbook = xlsx.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    res.render("submit",{data:jsonData})
})

app.patch('/write/:id', (req, res) => {
    const filePath = path.resolve(__dirname, 'output.xlsx');
    let data = [];
     let sheetName;
    try {
        const workbook = xlsx.readFile(filePath);
         sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        data = xlsx.utils.sheet_to_json(worksheet);
    } catch (error) {
        return res.status(500).send("Error reading file");
    }

    const id = req.params.id;
    const updated = {
        name: req.body.name,
        age: req.body.age,
        city: req.body.city
    };

    let found = false;
    data.forEach(item => {
        if (item.id == id) {  // Use == to allow type coercion between string and number
            found = true;
            item.name = updated.name !== undefined ? updated.name : item.name;
            item.age = updated.age !== undefined ? updated.age : item.age;
            item.city = updated.city !== undefined ? updated.city : item.city;
        }
    });

    if (!found) {
        return res.status(404).send("ID not found");
    }

    const newWorksheet = xlsx.utils.json_to_sheet(data);
    const newWorkbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);

    xlsx.writeFile(newWorkbook, filePath);
    res.send("Data updated successfully");
});

app.post('/write', (req, res) => {
    const filePath = path.resolve(__dirname, 'output.xlsx');


    let data = []
     
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        data = xlsx.utils.sheet_to_json(worksheet);
    } catch (error) {
        console.log("No existing file or error reading file, creating new one.");
    }

    data.push({
        id:req.body.ID,
        name: req.body.name,
        age: req.body.age,
        city: req.body.city,
       
    });
    
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    xlsx.writeFile(workbook, filePath);
    res.redirect('/read')
  });

app.listen(port,() => {
    console.log(`Server is running at port ${port}`);
})