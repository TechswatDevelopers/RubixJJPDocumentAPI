const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

const feedRoutes = require('./routes/feed')

const app = express()

// const fileStorage = multer.diskStorage({
//     destination:  (req, file, cb) => {
//         cb(null, 'images');
//     },
//     filename: (req, file, cb) =>{
//         cb(null, new Date().toISOString() + '-' + file.originalname);
//     }
// });
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images')
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4())
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

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*')
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   )
// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*', 'https://rubixdev.cjstudents.co.za:197', 'http://localhost:3000', 'http://localhost')
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  // res.setHeader('Access-Control-Allow-Credentials', true)
  // Pass to next layer of middleware
  next()
})
//   next()
//   // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
//   // next()
// })

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
