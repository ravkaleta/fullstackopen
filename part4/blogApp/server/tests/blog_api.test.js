const { test, after, beforeEach, before, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

let token = ''

describe('whene there are initially some blogs saved', () => {

    before(async () => {
        await User.deleteMany({})

        const testUser = {
            username: 'test',
            name: 'test',
            password: 'password'
        }

        await api
            .post('/api/users')
            .send(testUser)
            .expect(201)

        const loginData = {
            username: 'test',
            password: 'password'
        }

        const response = await api
            .post('/api/login')
            .send(loginData)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        token = 'Bearer ' + response.body.token
    })

    beforeEach(async () => {

        await Blog.deleteMany({})

        for(let blog of helper.initialBlogs) {
            let blogObject = new Blog(blog)
            await blogObject.save()
        }

    })

    test('blogs are returned in JSON format', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('blogs got unique indentifier named id', async () => {
        const blogs = await api.get('/api/blogs')
        assert(Object.keys(blogs.body[0]).includes('id'))
    })

    describe('addition of new blog', () => {

        describe('when token is valid', () => {

            test('succeeds with complete dataset', async () => {
                const newBlog = {
                    title: 'New Blog',
                    author: 'Me',
                    url: 'www.myblog.com',
                    likes: 80
                }
        
                await api.post('/api/blogs')
                    .set('Authorization', token)
                    .send(newBlog)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
        
                const blogsAtEnd = await helper.blogsInDb()
                assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
        
                const blogTitles = blogsAtEnd.map(blog => blog.title)
                assert(blogTitles.includes(newBlog.title))
            })

            describe('with missing property: ', () => {

                test('-likes, succeeds and its value is set to 0', async () => {
    
                    const newBlog = {
                        title: 'New Blog',
                        author: 'Me',
                        url: 'www.myblog.com',
                    }
            
                    const savedBlog = await api.post('/api/blogs') 
                        .set('Authorization', token)
                        .send(newBlog)
                        .expect(201)
                        .expect('Content-Type', /application\/json/)
            
                    assert.strictEqual(savedBlog.body.likes, 0)
                })
            
                test('-title, fails and backend responds with status code 400', async () => {
                    const newBlog = {
                        author: 'Me',
                        url: 'www.myblog.com',
                        likes: 80
                    }
            
                    await api.post('/api/blogs')
                        .set('Authorization', token)
                        .send(newBlog)
                        .expect(400)
                })
        
                test('-url, fails and backend responds with status code 400', async () => {
                    const newBlog = {
                        title: 'My Blog',
                        author: 'Me',
                        likes: 80
                    }
            
                    await api.post('/api/blogs')
                        .set('Authorization', token)
                        .send(newBlog)
                        .expect(400)
                })
            })
        })   
    })

    // describe('deletion of blog', () => {
    //     test('succeeds', async () => {
    //         const blogsAtStart = await helper.blogsInDb()
    //         const blogToDelete = blogsAtStart[0]
    
    //         await api
    //             .delete(`/api/blogs/${blogToDelete.id}`)
    //             .expect(204)
            
    //         const blogAtEnd = await helper.blogsInDb()
    //         assert.strictEqual(blogAtEnd.length, blogsAtStart.length - 1)
    
    //         const blogTitles = blogAtEnd.map(b => b.title)
    //         assert(!blogTitles.includes(blogToDelete.title))
    //     })
    // })
    
    // describe('update of blog', () => {
    //     test('succeeds', async () => {
    //         const blogsAtStart = await helper.blogsInDb()
    //         const blogToUpdate = blogsAtStart[0]

    //         const newBlog = {
    //             ...blogToUpdate,
    //             likes: blogToUpdate.likes + 1
    //         }

    //         const updatedBlog = await api
    //             .put(`/api/blogs/${blogToUpdate.id}`)
    //             .send(newBlog)
    //             .expect(200)
    //             .expect('Content-Type', /application\/json/)

    //         assert.strictEqual(updatedBlog.body.likes, newBlog.likes)
    //     })
    // })
})


after(async () => {
    await mongoose.connection.close()
})