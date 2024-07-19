const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
const Blog = require('../models/blog')

commentsRouter.post('/', async (request, response) => {
  const body = request.body

  const comment = new Comment({
    text: body.text,
    blog: body.blogId,
  })

  const savedComment = await comment.save()
  const blog = await Blog.findById(body.blogId)
  blog.comments = blog.comments.concat(savedComment._id)
  await blog.save()

  response.status(201).json(savedComment)
})

module.exports = commentsRouter
