// connection creation and creating a new db
const validator = require("validator")
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/puspuvandana")
  .then(() => console.log("Connection Successfull..."))
  .catch((err) => console.log(err));

// schema
// A Mongoose schema defines the structure of the document,
// default values,validators ,etc.

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true,
    lowercase:true,
    trim:true,
    minlength:2,
    maxlength:20
  },
  ctype: {
    type:String,
    required:true,
    lowercase:true,
    enum:["frontend","backend","database"]
  },
  videos: {
    type:Number,
    // validate(value){
    //     if (value < 0) {
    //         throw new Error("videos count should not be negative")
    //     }
    // }
    validate:{
        validator:function(value){
            return value.length < 0
        },
        message:"VIDEOS count should not be negative"
    }
  },
  author: String,
  email:{
    type:String,
    required:true,
    unique:true,
    validate(value){
        if (!validator.isEmail(value)) {
            throw new Error("Email is Invalid")
        }
    }
  },
  active: Boolean,
  date: {
    type: Date,
    default: Date.now(),
  },
});

// Collection creation

const Playlist = new mongoose.model("Playlist", playlistSchema);

// create document or insert

const createDocument = async () => {
  try {
    const mongoPlaylist = new Playlist({
      name: "Sql",
      ctype: "database",
      videos: 20,
      author: "vandana",
      email:"vandana@gmail.com",
      active: true,
    });

    // const javascriptPlaylist = new Playlist({
    //   name: "javascript",
    //   ctype: "front-end",
    //   videos: 56,
    //   author: "pushpender",
    //   active: true,
    // });

    // const htmlPlaylist = new Playlist({
    //   name: "HTML5",
    //   ctype: "frontend",
    //   videos: 47,
    //   author: "vandana",
    //   active: true,
    // });

    // const expressPlaylist = new Playlist({
    //   name: "Express js",
    //   ctype: "bsckend",
    //   videos: 277,
    //   author: "Ram",
    //   active: true,
    // });

    const result = await Playlist.insertMany([
      mongoPlaylist,
    //   javascriptPlaylist,
    //   htmlPlaylist,
    //   expressPlaylist,
    ]);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

   createDocument()

// const getDocument = async() => {
//   const result = await Playlist
//   .find({ctype : {$in : ["database","frontend"]}})
//   .select({name:1})
//   .limit()
//   console.log(result)
// }

// getDocument()

const getDocument = async () => {
  const result = await Playlist.find({
    $nor: [{ ctype: "frontend" }, { author: "Pushpender" }],
  })
    .select({ name: 1 })
    .sort({ name: -1 })
    .limit();
  console.log(result);
};

// getDocument()

// update the document

const updateDocument = async (_id) => {
  try {
    const result = await Playlist.findByIdAndUpdate(
      { _id },
      {
        $set: {
          name: "Python",
        },
      },{
        new:true,
        useFindAndModify:false
      }
    );
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

// updateDocument("6672cb10d2a68ebe9216c559");

// delete the documents

const deleteDocument = async(_id) => {
    try {
        const result = await Playlist.deleteOne({_id})
        console.log(result);
    } catch (error) {
       console.log(error); 
    }
   
}


// deleteDocument("6672c58daf5f6f58ec963697")

