const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const helper = require('./test_helper')

describe('addition of user', () => {

    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('password', 10)

        const user = new User({
            username: 'username',
            name: 'name',
            passwordHash: passwordHash
        })

        await user.save()
    })

    test('succeeds with valid parameters and fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'testUser',
            name: 'test',
            password: 'testPassword'
        }

        await api.post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        assert(usernames.includes(newUser.username))
    })

    test('fails when username is taken and responds with proper error message', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'username',
            name: 'test',
            password: 'testPassword'
        }

        const result = await api.post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

        assert(result.body.error.includes('expected `username` to be unique'))
    })

    test('fails when username has less than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'te',
            name: 'test',
            password: 'testPassword'
        }

        const result = await api.post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

        assert(result.body.error.includes('expected `username` to be unique'))
    })
})

after(async () => {
    await mongoose.connection.close()
})