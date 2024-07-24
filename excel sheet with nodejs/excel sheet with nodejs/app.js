const { z, ZodError } = require("zod");
const fs = require("fs");
const xlsx = require("xlsx");
const express = require("express");
const multer = require('multer');
const app = express();
const port = 3000;

//to set the view engine
app.set("view engine", "ejs");

//to serve static files
app.use("/public", express.static("public"));

//add middleware to recognize incomming request object as JSON object
app.use(express.json());
//middleware for post req to get the data
app.use(express.urlencoded({ extended: false }));

// Storage engine setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
})
// File type filtering
const fileFilter = function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG and PNG files are allowed!'), false);
    }
}
//middleware for upload file
const upload = multer({ storage: storage, fileFilter: fileFilter });


const filePath = "./public/demo.xlsx";

const contactFormSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email(),
    message: z.string().min(1, { message: "Message is required" }),
});

app.get("/", (req, res) => {
    res.render("Home");
});

app.post("/", upload.single("image"), (req, res) => {
    try {
        const data = contactFormSchema.parse(req.body);
        // Read the existing workbook
        const workbook = xlsx.readFile(filePath);

        const sheetName = 'Sheet1';
        const sheet = workbook.Sheets[sheetName];

        // index where you can append new data.
        let rowIndex = sheet['!ref'] ? xlsx.utils.decode_range(sheet['!ref']).e.r + 1 : 0;

        // Append the new data to the sheet
        sheet[xlsx.utils.encode_cell({ r: rowIndex, c: 0 })] = { t: 's', v: data.name };
        sheet[xlsx.utils.encode_cell({ r: rowIndex, c: 1 })] = { t: 's', v: data.email };
        sheet[xlsx.utils.encode_cell({ r: rowIndex, c: 2 })] = { t: 's', v: data.message };
        sheet[xlsx.utils.encode_cell({ r: rowIndex, c: 3 })] = { t: 's', v: req.file.filename };

        // Update the range of the sheet
        sheet['!ref'] = xlsx.utils.encode_range({
            s: { c: 0, r: 0 },
            e: { c: Object.keys(data).length, r: rowIndex }
        });
        // Write the updated workbook back to the file
        xlsx.writeFile(workbook, filePath);
        res.redirect("/");
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error });
        }
    }
});

app.get("/table", (req, res) => {
    try {
        const workbook = xlsx.readFile(filePath);
        let data = [];
        const sheets = workbook.SheetNames;
        for (let i = 0; i < sheets.length; i++) {
            const temp = xlsx.utils.sheet_to_json(
                workbook.Sheets[workbook.SheetNames[i]]
            );
            temp.forEach((res) => {
                data.push(res);
            });
        }
        console.log(data,"Sdfhswdgh")
        res.render("Table", { data:data });
    } catch (err) {
        res.status(500).send('Internal server error');
    }
});

app.get("/delete/:email", (req, res) => {
    try {
        const email = req.params.email;
        // Read the existing workbook
        const workbook = xlsx.readFile(filePath);
        const sheetName = "Sheet1";
        const sheet = workbook.Sheets[sheetName];

        // Check if sheet['!ref'] is defined
        if (sheet["!ref"]) {
            const range = xlsx.utils.decode_range(sheet["!ref"]);
            // Find the index of the row containing the student to remove
            let rowIndexToRemove = -1;
            for (let i = range.s.r; i <= range.e.r; i++) {
                const cellValue = sheet[xlsx.utils.encode_cell({ r: i, c: 1 })]?.v;
                if (cellValue === email) {
                    rowIndexToRemove = i;
                    break;
                }
            }
            // console.log(rowIndexToRemove);
            // Remove the row if it was found
            if (rowIndexToRemove !== -1) {
                for (let i = rowIndexToRemove; i <= range.e.r; i++) {
                    for (let j = range.s.c; j <= range.e.c; j++) {
                        const currentCell = sheet[xlsx.utils.encode_cell({ r: i, c: j })];
                        const nextCell = sheet[xlsx.utils.encode_cell({ r: i + 1, c: j })];
                        if (nextCell) {
                            currentCell.v = nextCell.v;
                        } else {
                            delete currentCell.v;
                        }
                    }
                }
                // Update the range of the sheet
                sheet["!ref"] = xlsx.utils.encode_range({
                    s: range.s,
                    e: { r: range.e.r - 1, c: range.e.c },
                });
            }

            // Write the updated workbook back to the file
            xlsx.writeFile(workbook, filePath);
            console.log("Data removed successfully.");
            res.redirect('/table');
        }
    } catch (err) {
        res.status(500).send('Internal server error');
    }
});

app.get("/:email", (req, res) => {
    try {
        const email = req.params.email;
        // Read the existing workbook
        const workbook = xlsx.readFile(filePath);

        const sheetName = 'Sheet1';
        const sheet = workbook.Sheets[sheetName];

        let rowIndex = -1;
        let rowData = {};

        const range = xlsx.utils.decode_range(sheet['!ref']);
        // Find the index of the row containing the specified condition value
        for (let i = range.s.r; i <= range.e.r; i++) {
            const cellValue = sheet[xlsx.utils.encode_cell({ r: i, c: 1 })]?.v;
            if (cellValue === email) {
                rowIndex = i;
                break;
            }
        }

        // If the row is found, retrieve the data from that row
        if (rowIndex !== -1) {
            for (let i = range.s.c; i <= range.e.c; i++) {
                const cellAddress = xlsx.utils.encode_cell({ r: rowIndex, c: i });
                const cellValue = sheet[cellAddress]?.v;
                const columnHeader = sheet[xlsx.utils.encode_cell({ r: range.s.r, c: i })]?.v; 
                rowData[columnHeader] = cellValue;
            }
        }
        console.log(rowData)
        res.render("Edit", {rowData:rowData});
    } catch (err) {
        res.status(500).send('Internal server error');
    }
})

app.post("/:email",upload.single("image"),(req, res) => {
    try {
        const { name, email, message } = req.body;
        console.log(name,email,message,"Segwreyhe")
        // Read the existing workbook
        const workbook = xlsx.readFile(filePath);

        const sheetName = 'Sheet1';
        const sheet = workbook.Sheets[sheetName];

        let rowIndexToUpdate = -1;
        const range = xlsx.utils.decode_range(sheet['!ref']);

        // Find the index of the row containing the specified condition value
        for (let i = range.s.r; i <= range.e.r; i++) {
            const cellValue = sheet[xlsx.utils.encode_cell({ r: i, c: 1 })]?.v;
            if (cellValue === req.params.email) {
                rowIndexToUpdate = i;
                break;
            }
        }

        // Update the data in the specified row
        if(req.file)
        {
            sheet[xlsx.utils.encode_cell({ r: rowIndexToUpdate, c: 0 })] = { t: 's', v: name };
            sheet[xlsx.utils.encode_cell({ r: rowIndexToUpdate, c: 1 })] = { t: 's', v: email };
            sheet[xlsx.utils.encode_cell({ r: rowIndexToUpdate, c: 2 })] = { t: 's', v: message };
            sheet[xlsx.utils.encode_cell({ r: rowIndexToUpdate, c: 3 })] = { t: 's', v: req.file.filename };
        }
        else{
            sheet[xlsx.utils.encode_cell({ r: rowIndexToUpdate, c: 0 })] = { t: 's', v: name };
            sheet[xlsx.utils.encode_cell({ r: rowIndexToUpdate, c: 1 })] = { t: 's', v: email };
            sheet[xlsx.utils.encode_cell({ r: rowIndexToUpdate, c: 2 })] = { t: 's', v: message };
        }
        // Write the updated workbook back to the file
        xlsx.writeFile(workbook, filePath);
        res.redirect("/table");
    } catch (err) {
        res.status(500).send('Internal server error');
    }
})
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
