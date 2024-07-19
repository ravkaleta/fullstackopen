const login = async (page, username, password) => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', {name: 'Login'}).click()
}

const addBlog = async (page, title, author, url) => {
    await page.getByRole('button', {name: 'add blog'}).click()
    await page.getByPlaceholder('title').fill(title)
    await page.getByPlaceholder('author').fill(author)
    await page.getByPlaceholder('url').fill(url)

    await page.getByRole('button', {name: 'Add blog'}).click()

    await page.getByText(title + ' ' + author).waitFor()
}

export { login, addBlog }