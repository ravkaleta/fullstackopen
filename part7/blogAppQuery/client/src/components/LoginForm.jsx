import { useContext, useState } from 'react'
import NotificationContext from '../contexts/notificationContext'
import blogService from '../services/blogs'
import loginService from '../services/login'
import UserContext from '../contexts/UserContext'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { setTempNotification } = useContext(NotificationContext)
  const { userDispatch } = useContext(UserContext)

  const navigate = useNavigate()

  const login = async (credentialsObject) => {
    try {
      const user = await loginService.login(credentialsObject)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      userDispatch({ type: 'SET', payload: user })
      navigate('/')
    } catch (exception) {
      setTempNotification('error', 'Incorret login or password', 5)
      console.log(exception)
    }
  }

  const loginSubmit = (event) => {
    event.preventDefault()
    const credentials = {
      username,
      password,
    }

    login(credentials)
    setUsername('')
    setPassword('')
  }

  return (
    <form
      onSubmit={loginSubmit}
      data-testid='loginForm'
      className='bg-primary w-1/5 h-1/2 rounded-xl flex items-center flex-col shadow-2xl'
    >
      <h1 className='h-2/6 flex items-center text-white text-lg font-bold'>
        Log in to application
      </h1>
      <div className='h-1/6 flex items-center space-x-4 '>
        <label className='text-white w-1/4'>Username: </label>
        <input
          data-testid='username'
          type='text'
          value={username}
          name='Username'
          className='bg-transparent border-b-2 w-3/4 border-accent text-white focus:outline-none'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div className='h-1/6 flex items-center space-x-4'>
        <label className='text-white w-1/4'>Password: </label>
        <input
          data-testid='password'
          type='password'
          value={password}
          name='Password'
          className='bg-transparent border-b-2 w-3/4 border-accent text-white focus:outline-none'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <div className='h-1/6 flex items-center'>
        <button
          type='submit'
          className='bg-accent hover:brightness-90 py-1 px-4 text-primary shadow-md font-bold rounded-lg transition-all duration-300'
        >
          Login
        </button>
      </div>
    </form>
  )
}

export default LoginForm
