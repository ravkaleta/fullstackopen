import { useState } from "react"

const BlogForm = ({createBlog}) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const blogSubmit = (event) => {
        event.preventDefault()
        const blogData = {
            title,
            author,
            url
        }

        createBlog(blogData)
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <form onSubmit={blogSubmit}>
            <div>
                title
                <input
                    type="text"
                    value={title}
                    name="Title"
                    placeholder="title"
                    onChange={({target}) => setTitle(target.value)}
                />
            </div>
            <div>
                author
                <input
                    type="text"
                    value={author}
                    name="Author"
                    placeholder="author"
                    onChange={({target}) => setAuthor(target.value)}
                />
            </div>
            <div>
                url
                <input
                    type="text"
                    value={url}
                    name="Url"
                    placeholder="url"
                    onChange={({target}) => setUrl(target.value)}
                />
            </div>
            <button type="submit">Add blog</button>
        </form>
    )
}

export default BlogForm