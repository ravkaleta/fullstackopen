const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {

    const blogs = await Blog
        .find({})
        .populate('user', {username: 1, name: 1, id: 1})
    response.status(200).json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user.id
    })

    
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    // const decodedToken = jwt.verify(request.token, process.env.SECRET)
    // if(!decodedToken.id){
    //     return response.status(401).json({error: 'token invalid'})
    // }

    // console.log(decodedToken)
    const user = request.user
    // console.log(user);
    const blog = await Blog.findById(request.params.id)
    // console.log(blog)
    // console.log(blog.user ? true : false)
    // console.log(blog.user.toString(), user._id.toString(), blog.user.toString() === user._id.toString())
    if(!blog.user || blog.user.toString() !== user._id.toString()){
        return response.status(401).json({error: 'user can only delete his own blogs'})
    }
    await blog.deleteOne()
    user.blogs = user.blogs.filter(b => b._id !== blog._id)
    await user.save()

    response.status(204).end()
}) 

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog
        .findByIdAndUpdate(
            request.params.id,
            blog,
            {new: true}
        )

    response.status(200).json(updatedBlog)
})


module.exports = blogsRouter