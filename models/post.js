const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    creator: {
      type: Object,
      required: String
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
    }
  },
  { timestamps: true }

)

module.exports = mongoose.model('Post', postSchema)
