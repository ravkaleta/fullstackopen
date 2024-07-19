import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { likeBlog, removeBlog } from '../reducers/blogReducer'

const Blog = ({ blog, loggedUserId }) => {
  const [visible, setVisibity] = useState(false)
  const dispatch = useDispatch()

  const toggleVisibility = () => {
    setVisibity(!visible)
    console.log(blog)
  }

  const handleBlogLike = () => {
    dispatch(likeBlog(blog.id))
  }

  const deleteBlog = () => {
    dispatch(removeBlog(blog.id))
  }

  const blogDetails = () => {
    return (
      <>
        <p>{blog.url}</p>
        <p>
          likes: {blog.likes}
          <button onClick={handleBlogLike}>like</button>
        </p>
        <p></p>
        <div
          style={{
            display:
              blog.user &&
              (blog.user.id === loggedUserId || blog.user === loggedUserId)
                ? ''
                : 'none',
          }}
        >
          <button onClick={deleteBlog} style={{ backgroundColor: 'blue' }}>
            remove
          </button>
        </div>
      </>
    )
  }

  return (
    <div
      data-testid='blog'
      id='title-and-author'
      style={{ borderStyle: 'solid', borderWidth: 1, borderColor: 'black' }}
    >
      {blog.title} {blog.author}
      <button onClick={toggleVisibility}>{!visible ? 'view' : 'hide'}</button>
      {visible && blogDetails()}
    </div>
  )
}

export default Blog
