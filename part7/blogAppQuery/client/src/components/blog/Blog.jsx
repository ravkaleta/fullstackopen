import { useContext, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../../services/blogs'
import NotificationContext from '../../contexts/notificationContext'
import { Link } from 'react-router-dom'
import UserContext from '../../contexts/UserContext'

const Blog = ({ blog }) => {
  const queryClient = useQueryClient()
  const { setTempNotification } = useContext(NotificationContext)
  const { user } = useContext(UserContext)

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      setTempNotification('success', 'Successfully deleted a blog', 5)
    },
  })

  const deleteBlog = () => {
    deleteBlogMutation.mutate(blog.id)
  }

  return (
    <div
      data-testid='blog'
      id='title-and-author'
      style={{ borderStyle: 'solid', borderWidth: 1, borderColor: 'black' }}
    >
      <Link to={`${blog.id}`}>
        {blog.title} {blog.author}
      </Link>
      {blog.user && (blog.user.id === user.id || blog.user === user.id) ? (
        <button onClick={deleteBlog} style={{ backgroundColor: 'blue' }}>
          remove
        </button>
      ) : (
        ''
      )}
    </div>
  )
}

export default Blog
