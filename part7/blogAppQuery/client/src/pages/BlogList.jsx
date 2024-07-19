import Blog from '../components/blog/Blog'
import Togglable from '../components/Togglable'
import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import UserContext from '../contexts/UserContext'
import blogService from '../services/blogs'
import BlogForm from '../components/blog/BlogForm'

const BlogList = () => {
  const blogQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  if (blogQuery.isError) {
    return <div>Error</div>
  }

  if (blogQuery.isLoading) {
    return <div>Loading...</div>
  }

  const blogs = blogQuery.data

  return (
    <div className='flex flex-grow flex-col items-center space-y-10'>
      <h2 className='text-white font-bold text-4xl'>BLOGS</h2>
      <Togglable buttonLabel='add blog'>
        <BlogForm />
      </Togglable>

      <div className='flex flex-col w-11/12 bg-background-light p-16 rounded-xl'>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  )
}

export default BlogList
