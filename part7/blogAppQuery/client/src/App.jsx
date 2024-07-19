import { useContext, useEffect } from 'react'
import blogService from './services/blogs'
import Notification from './components/Notification'
import UserContext from './contexts/UserContext'
import { Route, Routes, useNavigate } from 'react-router-dom'
import NavigationBar from './layouts/NavigationBar'
import Blogs from './pages/Blogs'
import Login from './pages/Login'
import Users from './pages/Users'
import Home from './pages/Home'

const App = () => {
  const { userDispatch } = useContext(UserContext)

  const userPrefersDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches

  if (userPrefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
  }

  const navigate = useNavigate()

  useEffect(() => {
    const userDataJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (userDataJSON) {
      const user = JSON.parse(userDataJSON)
      blogService.setToken(user.token)
      userDispatch({ type: 'SET', payload: user })
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <div className='w-screen h-screen bg-background flex flex-col'>
      <NavigationBar />
      <div className='flex flex-grow mt-10'>
        <Notification />
        <Routes>
          <Route path='/users/*' element={<Users />} />
          <Route path='/blogs/*' element={<Blogs />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Home />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
