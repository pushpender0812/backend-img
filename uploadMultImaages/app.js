const express = require("express");
require("./db/conn");
const MultiImage = require("./models/multiImage");
const ejs = require("ejs");
const path = require("path");
const multer = require("multer");
const { log } = require("console");
const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Multer configuration
// Storage engine setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});
// File type filtering
const fileFilter = function (req, file, cb) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG and PNG files are allowed!"), false);
  }
};
//middleware for upload file
const upload = multer({ storage: storage, fileFilter: fileFilter }).array(
  "images",
  12
);

app.get("/", async (req, res) => {
  res.render("home")
//   res.json("hello from server");
});

app.get("/upload", (req, res) => {
  res.render("upload");
});

app.post("/upload", upload, async (req, res) => {
  try {
    const files = req.files;
    // console.log("file", file);

    if (files.length<0) {
        return res.status(400).send({ message: "No files uploaded" });
      }
  
      const images = files.map(file => file.filename);

    const uploadImage = new MultiImage({
      name: req.body.name,
      images: images,
    });
    console.log("successful" + "   " + uploadImage);

    const data = await uploadImage.save();
    console.log(data.name)
    res.status(201).render("success",{files:data.images,name:data.name});
  } catch (error) {
    res.status(402).send("While uploading error",error);
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
