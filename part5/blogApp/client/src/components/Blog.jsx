import { useState } from "react"

const Blog = ({ blog, handleBlogLike, handleBlogDelete, loggedUserId }) => {
  const [visible, setVisibity] = useState(false)

  const toggleVisibility = () => {
    setVisibity(!visible)
  } 

  const likeBlog = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    handleBlogLike(updatedBlog)
  }

  const deleteBlog = () => {
    if(window.confirm(`Remove ${blog.title}`)){
      handleBlogDelete(blog.id)
    }
  }

  const blogDetails = () => {
    return (
      <>
        <p>{blog.url}</p>
        <p>
          likes: {blog.likes}
          <button onClick={likeBlog}>like</button>
        </p>
        <p></p>
        <div style={{display: blog.user && blog.user === loggedUserId ? '' : 'none'}}>
          <button onClick={deleteBlog} style={{backgroundColor: 'blue'}}>remove</button>
        </div>
      </>
    )
  }

  return (
      <div data-testid='blog' id="title-and-author" style={{borderStyle: 'solid', borderWidth: 1, borderColor: 'black'}}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{!visible ? 'view' : 'hide'}</button>
        {visible && blogDetails()}
      </div>
  )
}

export default Blog