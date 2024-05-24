const { nonExistingId } = require('../../../../practice/server/tests/test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')


const initialBlogs = [
    {
        title: 'First Blog',
        author: 'Adam Nowak',
        url: 'www.blog1.com',
        likes: 20
    },
    {
        title: 'Second Blog',
        author: 'Marcin Fiołkowski',
        url: 'www.blogSecond.com',
        likes: 55
    },
    {
        title: 'Third Blog',
        author: 'Mateusz Kowalski',
        url: 'www.blogThree.com',
        likes: 10
    },
]

const initialUsers = [
    {
        username: 'test',
        name: 'test',
        password: 'password'
    },
    {
        username: 'test2',
        name: 'test2',
        password: 'password'
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const getNotExistingId = async () => {
    const newBlog = new Blog({
        title: 'tempBlog',
        author: 'temp',
        url: 'www.tempBlog.com',
        likes: 0
    })

    await newBlog.save()
    await newBlog.deleteOne()

    return newBlog._id.toString()
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs,blogsInDb,getNotExistingId,
    usersInDb, initialUsers
}