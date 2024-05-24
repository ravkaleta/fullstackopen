import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import userEvent from '@testing-library/user-event'
import BlogForm from "./BlogForm";

test('blogform event handler receive right details when new blog is created', async () => {
    const user = userEvent.setup()
    const addBlog = vi.fn()

    render(<BlogForm createBlog={addBlog}/>)

    const titleInput = screen.getByPlaceholderText('title')
    const authorInput = screen.getByPlaceholderText('author')
    const urlInput = screen.getByPlaceholderText('url')

    const testBlog = {
        title: 'test title',
        author: 'test author',
        url: 'www.testurl.com'
    }

    await user.type(titleInput, testBlog.title)
    await user.type(authorInput, testBlog.author)
    await user.type(urlInput, testBlog.url)

    const submitButton = screen.getByText('Add blog')
    await user.click(submitButton)

    expect(addBlog.mock.calls[0][0]).toEqual(testBlog)
})