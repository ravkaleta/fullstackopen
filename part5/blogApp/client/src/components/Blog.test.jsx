import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import userEvent from '@testing-library/user-event'
import Blog from "./Blog";

const blog = {
    title: 'Test blog',
    author: 'test user',
    url: 'www.test.com',
    likes: 0,
    user: {
        id: 'testid'
    }
}

describe('by default component', () => {

    let container

    beforeEach(() => {
        container = render(<Blog blog={blog}/>).container
    })

    test('renders title and author', () => {
        const titleAndAuthor = container.querySelector('#title-and-author')
        expect(titleAndAuthor).toBeDefined()
    })

    test('does not render blog url', () => {
        const url = screen.queryByText(blog.url) || null
        expect(url).toBeNull()
    })

    test('does not render blog likes', () => {
        const likes = screen.queryByText('likes: ' + blog.likes)
        expect(likes).toBeNull()
    })

})

describe('after clicking details button', () => {

    let container
    const likeBlog = vi.fn()
    const user = userEvent.setup()

    beforeEach(async () => {
        container = render(<Blog blog={blog} handleBlogLike={likeBlog}/>).container

        const detailsButton = screen.getByText('view')
        await user.click(detailsButton)
    })
    
    test('component renders blog url and likes', async () => {
        const url = screen.getByText(blog.url) || null
        expect(url).toBeDefined()
        
        const likes = screen.getByText('likes: ' + blog.likes)
        expect(likes).toBeDefined()
    })

    test('clicking like button calls event handler twice', async () => {
        const likeButton = screen.getByText('like')
        await user.click(likeButton)
        await user.click(likeButton)

        expect(likeBlog.mock.calls).toHaveLength(2)
    })
})

