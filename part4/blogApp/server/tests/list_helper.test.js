const { describe, test } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

const listWithSingleBlog = [
    {
        title: "First BLOG",
        author: "Adam Nowak",
        url: "abc.com",
        likes: 20,
        id: "663e50cb3534e2106de3acab"
    }
]

const listWithMultipleBlogs = [
    {
        title: "First BLOG",
        author: "Adam Nowak",
        url: "abc.com",
        likes: 20,
        id: "663e50cb3534e2106de3acab"
      },
      {
        title: "Second BLOG",
        author: "Marcin Kowalski",
        url: "test.com",
        likes: 15,
        id: "663f33b528f75256c439aa88"
      },
      {
        title: "Third BLOG",
        author: "Janusz Smith",
        url: "myblog.com",
        likes: 45,
        id: "663f33e528f75256c439aa8a"
      },
      {
        title: "Fourth BLOG",
        author: "Adam Nowak",
        url: "myblog2.com",
        likes: 30,
        id: "663f33e528f75256c439aa88"
      }
]


test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {

    test('of empty list is zero', () => {
        assert.strictEqual(listHelper.totalLikes([]), 0)
    })

    test('when list has only one blog equals the likes of that', () => {
        assert.strictEqual(listHelper.totalLikes(listWithSingleBlog), 20)
    })

    test('of a bigger list is calculated right', () => {
        assert.strictEqual(listHelper.totalLikes(listWithMultipleBlogs), 110)
    })
})


describe('best blog', () => {

    test('of empty list is null', () => {
        assert.strictEqual(listHelper.favoriteBlog([]), null)
    })

    test('when list has only one blog equals that blog', () => {
        assert.deepStrictEqual(listHelper.favoriteBlog(listWithSingleBlog), 
            {
                title: "First BLOG",
                author: "Adam Nowak",
                url: "abc.com",
                likes: 20,
                id: "663e50cb3534e2106de3acab"
            }
        )
    })

    test('of a bigger list is picked right', () => {
        assert.deepStrictEqual(listHelper.favoriteBlog(listWithMultipleBlogs), 
            {
                title: "Third BLOG",
                author: "Janusz Smith",
                url: "myblog.com",
                likes: 45,
                id: "663f33e528f75256c439aa8a"
            }
        )
    })
})

describe('most blogs', () => {

    test('of empty list is null', () => {
        assert.strictEqual(listHelper.mostBlogs([]), null)
    })

    test('when list has only one blog equals that blog author and 1 blog', () => {
        assert.deepStrictEqual(listHelper.mostBlogs(listWithSingleBlog), 
            {
                author: "Adam Nowak",
                blogs: 1
            }
        )
    })

    test('of a bigger list is picked right', () => {
        assert.deepStrictEqual(listHelper.mostBlogs(listWithMultipleBlogs), 
            {
                author: "Adam Nowak",
                blogs: 2
            }
        )
    })
})

describe('most likes', () => {

    test('of empty list is null', () => {
        assert.strictEqual(listHelper.mostLikes([]), null)
    })

    test('when list has only one blog equals that blog author and its likes', () => {
        assert.deepStrictEqual(listHelper.mostLikes(listWithSingleBlog), 
            {
                author: "Adam Nowak",
                likes: 20
            }
        )
    })

    test('of a bigger list is picked right', () => {
        assert.deepStrictEqual(listHelper.mostLikes(listWithMultipleBlogs), 
            {
                author: "Adam Nowak",
                likes: 50
            }
        )
    })
})