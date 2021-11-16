const mongoose = require('mongoose')
const { Numeric } = require('mssql')
const Schema = mongoose.Schema

const postSchema = new Schema(
  {
    RubixRegisterUserID: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    FileType: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    fileextension: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    ImageID: {
      type: String,
      required: true
    }
  },
  { timestamps: true }

)

module.exports = mongoose.model('Post', postSchema)
