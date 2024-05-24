import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const NotificationMessage = ({message}) => {
  const color = message.type === 'error' ? 'red' : 'green'

  return (
    <h1 style={{borderWidth: 1, borderStyle: 'solid',borderColor: color, color: color}}>
      {message.text}
    </h1>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notifyMessage, setNotifyMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs( blogs )
    })  
  }, [])

  useEffect(() => {
    const userDataJSON = window.localStorage.getItem('loggedBlogAppUser')
    if(userDataJSON){
      const user = JSON.parse(userDataJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
    
  }, [])

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken('')
  }

  const handleLogin = async (credentialsObject) => {
    try {
      const user = await loginService.login(credentialsObject)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setNotifyMessage({type: 'error', text: 'Wrong credentials'})
      setTimeout(() => {
        setNotifyMessage(null)
      }, 5000)
    }
  }

  const handleBlogCreate = async (blogObject) => {
    try {
      const addedBlog = await blogService.addBlog(blogObject)
      console.log('added', addedBlog)
      setBlogs(blogs => blogs.concat(addedBlog))

      setNotifyMessage({type: 'success', text: `Added new blog ${addedBlog.title} by ${addedBlog.author}`})
      setTimeout(() => {
        setNotifyMessage(null)
      }, 5000)
    } catch (exception) {
      setNotifyMessage({type: 'error', text: 'Missing properties'})
      setTimeout(() => {
        setNotifyMessage(null)
      }, 5000)
    }
    
  }

  const handleBlogLike = async (blogObject) => {
    try {
      const updatedBlog = await blogService.likeBlog(blogObject)
      setBlogs(blogs => blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog))
    } catch (exception) {
      console.log(exception)
    }
  }

  const handleBlogDelete = async (id) => {
    try {
      await blogService.deleteBlog(id)
      setBlogs(blogs => blogs.filter(blog => blog.id !== id))
    } catch (exception) {
      console.log(exception)
    }
  }

  const blogList = () => (
    <>
      <h2>blogs</h2>
      <Togglable buttonLabel="add blog">
        <BlogForm createBlog={handleBlogCreate}/>
      </Togglable>


      <p>
        {user.name} logged in
        <button onClick={handleLogout}>Log out</button>
      </p>

      {blogs.map(blog =>
        <Blog 
          key={blog.id} 
          blog={blog} 
          handleBlogLike={handleBlogLike} 
          handleBlogDelete={handleBlogDelete}
          loggedUserId={user.id}
        />
      )}
    </>
  )

  return (
    <div>

      {notifyMessage && <NotificationMessage message={notifyMessage}/>}
      {user ? blogList() : <LoginForm login={handleLogin}/>}
      
    </div>
  )
}

export default App