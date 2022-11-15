const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')

const feedRoutes = require('./routes/feed')

const app = express()

// const fileStorage = multer.diskStorage({
//     destination:  (req, file, cb) => {
//         cb(null, 'images');
//     },
//     filename: (req, file, cb) =>{
//         cb(null,file.originalname);
//     }
// });

// app.use(function (req, res, next) {
//   Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin:', ' *', 'https://rubixdev.cjstudents.co.za:446 ', 'http://localhost:3300', 'http://localhost', 'https://rubix.cjstudents.co.za:446')
//   Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST')

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images')
  },
  filename: function (req, file, cb) {
    if (file.mimetype === 'image/png') {
      cb(null, uuidv4() + '.png')
    } else if (file.mimetype === 'image/jpg') {
      cb(null, uuidv4() + '.jpg')
    } else if (file.mimetype === 'image/jpeg') {
      cb(null, uuidv4() + '.jpeg')
    } else if (file.mimetype === 'application/pdf') {
      cb(null, uuidv4() + '.pdf')
    }
  }
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json())
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))

app.use(cors({
  origin: ['https://jjp.rubix.mobi', 'http://localhost:3000']
}))

app.use(cors({
  methods: ['GET', 'POST']
}))

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/feed', feedRoutes)

app.use((error, req, res, next) => {
  console.log(error)
  const status = error.statusCode || 500
  const message = error.message
  res.status(status).json({ message: message })
})

app.use('/feed', feedRoutes)

mongoose
  .connect(
    'mongodb://localhost:27017/messages?retryWrites=true'
  )
  .then(result => {
    app.listen(3001)
  })
  .catch(err => console.log(err))
