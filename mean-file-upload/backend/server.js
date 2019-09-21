const express = require('express'),
  path = require('path'),
  cors = require('cors'),
  multer = require('multer'),
  bodyParser = require('body-parser');

const mongoose = require('mongoose');

const Post = require('./models/post');

// File upload settings
const PATH = './uploads';

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + '-' + Date.now() + '.strings')
  }
});

let upload = multer({
  storage: storage
});

// Express settings
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// MongoDB settings
mongoose.connect("mongodb+srv://tanapuch:Hm3cdy7Umm8fiVvF@cluster0-0euso.mongodb.net/test?retryWrites=true&w=majority", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to database!')
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.get('/api', function (req, res) {
  res.end('File catcher');
});

// POST File
const fs = require('fs')
filePath = ''

app.post('/api/upload', upload.single('image'), function (req, res) {
  var result = '';
  if (!req.file) {
    console.log("No file is available!");
    return res.send({
      success: false
    });

  } else {
    console.log('File is available!');

    fs.readFile(req.file.path, 'utf8', function(err, data) {

      let splitted = data.toString().split(";\n");
      for (let i = 0; i < splitted.length; i++) {
        let splitLine = splitted[i].split(" = ");
        const post = new Post({
          // someStr.replace(/"/g, '') This removes double quotes from strings.
          // The condition is to insert "null" as a placeholder in case the line does not contain a string.
          // This is to prevent TypeError of undefined.

          key: (splitLine[0]===undefined ? "null" : splitLine[0].replace(/"/g, '')),
          value: (splitLine[1]===undefined ? "null" : splitLine[1].replace(/"/g, ''))

        });
        console.log(post);
        post.save()
      }
    });

    return res.send({
      success: true
    })
  }
});

// Create PORT
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log('Connected to port ' + PORT)
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
