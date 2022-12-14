const express = require('express')
const { body } = require('express-validator')

const feedController = require('../controllers/feed')

const router = express.Router()

// GET /feed/posts
router.get('/posts', feedController.getPosts)

// POST /feed/post
router.post(
  '/post',
  [
    body('RubixRegisterUserID')
      .trim()
      .isLength({ min: 1 }),
    body('FileType')
      .trim()
      .isLength({ min: 2 })
  ],
  feedController.createPost
)

router.get('/post/:postId', feedController.getPost)

router.get('/base/:postId', feedController.getBase)

// router.put(
//   '/post/:postId',
//   [
//     body('RubixRegisterUserID')
//       .trim()
//       .isLength({ min: 1 }),
//     body('FileType')
//       .trim()
//       .isLength({ min: 5 })
//   ],
//   feedController.updatePost
// )

// router.put(
//   '/base/:postId',
//   [
//     body('RubixRegisterUserID')
//       .trim()
//       .isLength({ min: 1 }),
//     body('FileType')
//       .trim()
//       .isLength({ min: 5 })
//   ],
//   feedController.updatePost
// )

router.delete('/post/:postId', feedController.deletePost)

module.exports = router
