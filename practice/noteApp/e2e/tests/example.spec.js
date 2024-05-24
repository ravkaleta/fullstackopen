const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

describe('Note app', () => {

  beforeEach(async ({page, request}) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'testUsername',
        name: 'testName',
        password: 'testPassword'
      }
    })

    await page.goto('/')
  })

  test('front page can be opened', async ({page}) => {
    const locator = await page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
  })

  test('login form can be opened', async ({page}) => {
    await loginWith(page, 'testUsername', 'testPassword')

    await expect(page.getByText('testName logged')).toBeVisible()
  })

  test('login fails with wrong password', async ({page}) => {
    await loginWith(page, 'testUsername', 'wrong-password')

    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('Wrong credentials')

    await expect(page.getByText('testName logged')).not.toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({page}) => {
      await loginWith(page, 'testUsername', 'testPassword')
    })

    test('a new note can be created', async ({page}) => {
      await createNote(page, 'a note created by playwright')
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    describe('and several notes exists', () => {
      beforeEach(async ({page}) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'third note')
      })

      test.only('importance can be changed', async ({page}) => {
        const otherNoteElement = await page.getByText('second note').locator('..')
        await otherNoteElement.getByRole('button', {name: 'make not important'}).click()
        await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })
    })
  })


})
