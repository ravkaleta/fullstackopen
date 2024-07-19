import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './Blog'
import { initializeBlogs } from '../reducers/blogReducer'

const BlogList = ({ loggedUserId }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  const blogs = useSelector(({ blogs }) => {
    return [...blogs].sort((a, b) => b.likes - a.likes)
  })

  return blogs.map((blog) => (
    <Blog key={blog.id} blog={blog} loggedUserId={loggedUserId} />
  ))
}

export default BlogList
