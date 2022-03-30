const fs = require('fs')
const path = require('path')

const { validationResult } = require('express-validator')

const Post = require('../models/post')

const FileName = ''

exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res
        .status(200)
        .json({ message: 'Fetched posts successfully', posts: posts })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.createPost = async function (req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('validation failed data is incorrect')
    console.log(req.body)
    error.statusCode = 422
    throw error
}
  if (!req.file) {
    const error = new Error('No image provided')
    error.statusCode = 422
    throw error
  }
  let ImageID = ''
  const imageUrl = req.file.path.replace('\\', '/')
  const img = fs.readFileSync(req.file.path)
  const encodeImage = img.toString('base64')
  const RubixRegisterUserID = req.body.RubixRegisterUserID
  const FileType = req.body.FileType
  const fileextension = req.file.mimetype
  const filename = req.file.originalname
  const fileSizeInBytes = req.file.size
  const fileName = req.file.filename
  // Convert the file size to megabytes (optional)
  const fileSizeInMegabytes = fileSizeInBytes
  // console.log(fileName)
  // if (req.file.mimetype === 'image/png') {
  //   FileName = fileName + '.png'
  // } else if (req.file.mimetype === 'image/jpg') {
  //   FileName = fileName + '.jpg'
  // } else if (req.file.mimetype === 'image/jpeg') {
  //   FileName = fileName + '.jpeg'
  // } else if (req.file.mimetype === 'application/pdf') {
  //   FileName = fileName + '.pdf'
  // }
  const mssqlcon = require('../dbconnection')
  const conn = await mssqlcon.getConnection()
  const rest = await conn.request()
  if (RubixRegisterUserID === 'null' || RubixRegisterUserID === null) {
    console.log('Trying to add null value', RubixRegisterUserID)
  } else {
    async function addToDb () {
      return new Promise(function (resolve, reject) {
        rest
          .input('RubixRegisterUserID', RubixRegisterUserID)
          .input('FileType', FileType)
          .input('imageUrl', imageUrl)
          .input('FileName', fileName)
          .input('FileExtension', fileextension)
          .input('image', filename)
          .input('FileSize', fileSizeInMegabytes)
          .execute('[dbo].[Dsp_AddRubixRegisterUserDocuments]', function (err, recordsets) {
            // console.log(res)
            if (err) {
              reject(err)
            } else {
              ImageID = recordsets.recordset[0].ImageID
              resolve(ImageID)
            }
          })
      })
    } const VarTemp = await addToDb()
    console.log(VarTemp)
    const post = new Post({
      RubixRegisterUserID: RubixRegisterUserID,
      FileType: FileType,
      imageUrl: imageUrl,
      filename: fileName,
      fileextension: fileextension,
      image: encodeImage,
      ImageID: VarTemp
      // image: new Buffer.From(encodeImage, 'base64'),
      // creator: { name: 'Mikkie' }
    })
    post
      .save()
      .then(result => {
        res.status(201).json({
          message: 'Post created successfully!',
          ImageID: VarTemp,
          post: result
        })
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500
        }
        next(err)
      })
  }
}


exports.getPost = async function (req, res, next) {
  const RubixRegisterUserID = req.params.postId
  // console.log(RubixRegisterUserID)
  // console.log(req.params.postId)
  const ImageID = []

  const mssqlcon = require('../dbconnection')
  const conn = await mssqlcon.getConnection()
  const rest = await conn.request()

  async function GetLatestSQLDocuments() {
    return new Promise(function (resolve, reject) {
      if (RubixRegisterUserID === 'null' || RubixRegisterUserID === null) {
        console.log('ID Empty')
      } else {
        rest
          .input('RubixRegisterUserID', RubixRegisterUserID)
          .execute('[dbo].[Dsp_RubixGetAllDocuments]', function (err, recordsets) {
            // console.log(res)
            if (err) {
              reject(err)
            } else {
              // console.log('in if statement')
              for (let index = 0; index < recordsets.recordset.length; index++) {
                if (recordsets.recordset[index] !== undefined) {
                  ImageID.push(recordsets.recordset[index].LastId)
                }
              }
              // if (recordsets.recordset[0] === undefined && recordsets.recordset[1] === undefined && recordsets.recordset[2] === undefined && recordsets.recordset[3] === undefined) {
              //   console.log('1st if')
              //   ImageID = ['No Record']
              // } else if (recordsets.recordset[1] === undefined && recordsets.recordset[2] === undefined && recordsets.recordset[3] === undefined) {
              //   console.log('2nd if')
              //   ImageID = [recordsets.recordset[0].LastId]
              // } else if (recordsets.recordset[2] === undefined && recordsets.recordset[3] === undefined) {
              //   console.log('3rd if')
              //   ImageID = [recordsets.recordset[0].LastId,
              //   recordsets.recordset[1].LastId]
              // } else if (recordsets.recordset[3] === undefined) {
              //   console.log('4rth if')
              //   ImageID = [recordsets.recordset[0].LastId,
              //   recordsets.recordset[1].LastId,
              //   recordsets.recordset[2].LastId]
              // } else {
              //   console.log('else')
              //   ImageID = [recordsets.recordset[0].LastId,
              //   recordsets.recordset[1].LastId,
              //   recordsets.recordset[2].LastId,
              //   recordsets.recordset[3].LastId]
              //   console.log(ImageID)
              // }
              resolve(ImageID)
            }
          })
      }
    })
  } const VarTempDocumentID = await GetLatestSQLDocuments()
  // console.log('varid', VarTempDocumentID)

  Post.find({ ImageID: VarTempDocumentID }, { image: 0, updatedAt: 0, createdAt: 0, _id: 0, __v: 0, fileextension: 0, imageUrl: 0 }).limit(7)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.')
        error.statusCode = 404
        throw error
      }
      res.status(200).json({ message: 'Post fetched.', post: post })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.')
    error.statusCode = 422
    throw error
  }
  const RubixRegisterUserID = req.body.RubixRegisterUserID
  const FileType = req.body.FileType
  let imageUrl = req.body.image
  if (req.file) {
    imageUrl = req.file.path.replace('\\', '/')
  }
  if (!imageUrl) {
    const error = new Error('No file picked.')
    error.statusCode = 422
    throw error
  }
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.')
        error.statusCode = 404
        throw error
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl)
      }
      post.RubixRegisterUserID = RubixRegisterUserID
      post.imageUrl = imageUrl
      post.FileType = FileType
      return post.save()
    })
    .then(result => {
      res.status(200).json({ message: 'Post updated!', post: result })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.')
        error.statusCode = 404
        throw error
      }
      // check logged in user
      clearImage(post.imageUrl)
      return Post.findByIdAndRemove(postId)
    })
    .then(result => {
      console.log(result)
      res.status(200).json({ message: 'Deleted post' })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath)
  fs.unlink(filePath, err => console.log(err))
}
