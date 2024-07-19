const { test, expect, beforeEach, before, describe } = require('@playwright/test')
const { addBlog, login } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({page, request}) => {
    await request.post('/api/tests/reset')
    await request.post('/api/users', {
      data: {
        username: 'testUsername',
        name: 'testName',
        password: 'testPassword'
      }
    })

    await request.post('/api/users', {
      data: {
        username: 'differentUsername',
        name: 'differentName',
        password: 'differentPassword'
      }
    })

    await page.goto('/')
  })

  test('page can be opened', async ({page}) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  test('Login form is shown', async ({page}) => {
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

  describe('Login', () => {

    test('succeeds with valid credentials', async ({page}) => {
      await login(page, 'testUsername', 'testPassword')
      await expect(page.getByText('testName logged in')).toBeVisible()
    })
    test('fails with invalid credentials', async ({page}) => {
      await login(page, 'testUsername', 'wrong-password')
      await expect(page.getByText('Wrong credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {

    beforeEach(async ({page}) => {
      await login(page, 'testUsername', 'testPassword')
    })

    test('a new blog can be created', async ({page}) => {
      await addBlog(page, 'First Blog', 'Author', 'www.firstBlog.com')

      const addedBlog = await page.getByText('First Blog Author')
      await expect(addedBlog).toBeVisible()
      await expect(addedBlog.getByRole('button', { name: 'view'})).toBeVisible()
    })

    describe('and there are already other blogs, then different user', () => {
      beforeEach(async ({page}) => {
        await addBlog(page, 'First Blog', 'Author', 'www.firstBlog.com')
        await addBlog(page, 'Second Blog', 'Author', 'www.secondBlog.com')
        await addBlog(page, 'Third Blog', 'Author', 'www.thirdBlog.com')
        await page.getByRole('button', { name: 'Log out'}).click()
        await login(page, 'differentUsername', 'differentPassword')
      })

      test('can like the blog', async ({page}) => {
        const blogElement = await page.getByText('Second Blog Author')
        await blogElement.getByRole('button', { name: 'view' }).click()
        await blogElement.getByRole('button', { name: 'like' }).click()
        
        await expect(blogElement.getByText('likes: 1')).toBeVisible()
      })

      test('can delete his own blog', async ({page}) => {
        await addBlog(page, 'Another Blog', 'Another Author', 'www.anotherBlog.com')
        const addedBlog = await page.getByText('Another Blog Another Author')
        await addedBlog.getByRole('button', {name: 'view'}).click()
        await expect(addedBlog.getByRole('button', {name: 'remove'})).toBeVisible()
      })  

      test('but cannot delete other blogs', async ({page}) => {
        const blog = await page.getByText('Second Blog Author')
        await blog.getByRole('button', {name: 'view'}).click()
        await expect(blog.getByText('www.secondBlog.com')).toBeVisible()
        await expect(blog.getByRole('button', {name: 'remove'})).not.toBeVisible()
      })  

    })
  })

})

test.only('blogs are arranged in the order according to the likes', async ({page, request}) => {
  await request.post('/api/tests/reset')
  await request.post('/api/users', {
    data: {
      username: 'testUsername',
      name: 'testName',
      password: 'testPassword'
    }
  })

  await request.post('/api/users', {
    data: {
      username: 'differentUsername',
      name: 'differentName',
      password: 'differentPassword'
    }
  })

  const response = await request.post('/api/login', 
    {
      data: {
        username: 'testUsername',
        password: 'testPassword'
      }
    }
  )

  const responseBody = await response.json()
  const token = responseBody.token

  const blogsData = [
    { title: 'title1', author: 'author1', url: 'blog1.com', likes: 25 },
    { title: 'title2', author: 'author2', url: 'blog2.com', likes: 40 },
    { title: 'title3', author: 'author3', url: 'blog3.com', likes: 30 },
    { title: 'title4', author: 'author4', url: 'blog4.com', likes: 80 }
  ]

  for(const blog of blogsData) {
    await request.post('/api/blogs', {
      headers: {'Authorization': `Bearer ${token}`}, 
      data: blog
    })
  }    
  await page.goto('/')
  await login(page, 'differentUsername', 'differentPassword')
  
  const blogs = await page.getByTestId('blog')
  await expect(blogs.first()).toContainText('title4 author4')
  await expect(blogs.nth(1)).toContainText('title2 author2')
  await expect(blogs.nth(2)).toContainText('title3 author3')
  await expect(blogs.last()).toContainText('title1 author1')
})
