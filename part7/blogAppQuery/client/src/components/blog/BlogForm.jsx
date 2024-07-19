import { useContext, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../../services/blogs'
import NotificationContext from '../../contexts/notificationContext'

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const { setTempNotification } = useContext(NotificationContext)

  const queryClient = useQueryClient()

  const createBlogMutation = useMutation({
    mutationFn: blogService.addBlog,
    onSuccess: (newBlog) => {
      setTempNotification(
        'success',
        `Added new blog ${newBlog.title} by ${newBlog.author}`,
        5
      )
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
    },
    onError: () => {
      setTempNotification('error', 'Failed to add new blog', 5)
    },
  })

  const blogSubmit = (event) => {
    event.preventDefault()
    const blogData = {
      title,
      author,
      url,
    }
    createBlogMutation.mutate(blogData)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={blogSubmit}>
      <div>
        title
        <input
          type='text'
          value={title}
          name='Title'
          placeholder='title'
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author
        <input
          type='text'
          value={author}
          name='Author'
          placeholder='author'
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url
        <input
          type='text'
          value={url}
          name='Url'
          placeholder='url'
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type='submit'>Add blog</button>
    </form>
  )
}

export default BlogForm
