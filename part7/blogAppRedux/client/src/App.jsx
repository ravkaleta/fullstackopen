import { useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import { useDispatch, useSelector } from 'react-redux'
import { setTempNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import BlogList from './components/BlogList'

const App = () => {
  const user = useSelector(({ user }) => user)

  const dispatch = useDispatch()

  useEffect(() => {
    const userDataJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (userDataJSON) {
      const user = JSON.parse(userDataJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }, [])

  const handleLogout = () => {
    dispatch(setUser(null))
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken('')
  }

  const handleLogin = async (credentialsObject) => {
    try {
      const user = await loginService.login(credentialsObject)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
    } catch (exception) {
      dispatch(setTempNotification('error', 'Wrong credentials', 5))
    }
  }

  const blogList = () => (
    <>
      <h2>blogs</h2>
      <Togglable buttonLabel='add blog'>
        <BlogForm />
      </Togglable>

      <p>
        {user.name} logged in
        <button onClick={handleLogout}>Log out</button>
      </p>

      <BlogList loggedUserId={user.id} />
    </>
  )

  return (
    <div>
      <Notification />
      {user ? blogList() : <LoginForm login={handleLogin} />}
    </div>
  )
}

export default App
