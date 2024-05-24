const { test, after, beforeEach, describe, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')
const User = require('../models/user')


describe('when there is initially some notes saved', () => {

    beforeEach(async () => {
        await Note.deleteMany({})
        await Note.insertMany(helper.initialNotes)
    })

    test('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all notes are returned', async () => {
        const response = await api.get('/api/notes')

        assert.strictEqual(response.body.length, helper.initialNotes.length)
    })

    test('a specific note is within the returned notes', async () => {
        const response = await api.get('/api/notes')

        const contents = response.body.map(e => e.content)
        assert(contents.includes('Browser can execute only JavaScript'))
    })



    describe('viewing a specific note', () => {

        test('succeeds with a valid id', async () => {
            const notesAtStart = await helper.notesInDb()
    
            const noteToView = notesAtStart[0]
    
            const resultNote = await api
                .get(`/api/notes/${noteToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)
    
            assert.deepStrictEqual(resultNote.body, noteToView)
        })

        test('fails with statuscode 404 if note does not exists', async () => {
            const validNonexistingId = await helper.nonExistingId()

            await api
                .get(`/api/notes/${validNonexistingId}`)
                .expect(404)
        })

        test('fails with statuscode 400 if id is invalid', async () => {
            const invalidId = '1242h1l4jkh21kl2j135'

            await api
                .get(`/api/notes/${invalidId}`)
                .expect(400)
        })
    })



    describe('addition of a new note', () => {

        let token

        before(async () => {
            await User.deleteMany({})

            const testUser = {
                username: 'testUsername',
                name: 'testName',
                password: 'testPassword'
            }

            await api
                .post('/api/users')
                .send(testUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const response = await api
                .post('/api/login')
                .send({username: testUser.username, password: testUser.password})
                .expect(200)
                .expect('Content-Type', /application\/json/)

            token = 'Bearer ' + response.body.token
        })

        describe('when user got valid token', () => {

            test('succeeds with a valid data', async () => {
                const newNote = {
                    content: 'async/await simplifies making async calls',
                    important: true
                }
        
                await api
                    .post('/api/notes')
                    .set('Authorization', token)
                    .send(newNote)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
        
                const notesAtEnd = await helper.notesInDb()
                assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)
        
                const contents = notesAtEnd.map(n => n.content)
                assert(contents.includes('async/await simplifies making async calls'))
            })
        
            test('fails with status code 400 when no content is provided', async () => {
                const newNote = {
                    important: true
                }
        
                await api
                    .post('/api/notes')
                    .set('Authorization', token)
                    .send(newNote)
                    .expect(400)
        
                const notesAtEnd = await helper.notesInDb()
        
                assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
            })
        })

        test('fails with invalid token', async () => {
            const newNote = {
                content: 'async/await simplifies making async calls',
                important: true
            }
    
            await api
                .post('/api/notes')
                .set('Authorization', 'invalid token')
                .send(newNote)
                .expect(401)
                .expect('Content-Type', /application\/json/)
    
            const notesAtEnd = await helper.notesInDb()
            assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    
            const contents = notesAtEnd.map(n => n.content)
            assert(!contents.includes('async/await simplifies making async calls'))
        })

    })

    

    describe('deletion of a note', () => {

        test('a note can be deleted', async () => {
            const notesAtStart = await helper.notesInDb()
            const noteToDelete = notesAtStart[0]
    
            await api
                .delete(`/api/notes/${noteToDelete.id}`)
                .expect(204)
    
            const notesAtEnd = await helper.notesInDb();
    
            const contents = notesAtEnd.map(r => r.content)
            assert(!contents.includes(noteToDelete.content))
    
            assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
        })

    })
    

    
})

after(async () => {
    await mongoose.connection.close()
})