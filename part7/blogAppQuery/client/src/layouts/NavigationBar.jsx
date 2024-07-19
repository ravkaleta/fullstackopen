import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UserContext from '../contexts/UserContext'
import blogService from '../services/blogs'

const NavigationBar = () => {
  const { user, userDispatch } = useContext(UserContext)

  const navigate = useNavigate()

  const handleLogout = () => {
    userDispatch({ type: 'RESET' })
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken('')
    navigate('/login')
  }

  return (
    <nav className='bg-primary fixed w-screen h-10 top-0 flex items-center before:w-1/3'>
      <div className='text-white text-lg font-bold space-x-14 w-1/3 flex justify-center'>
        <Link
          to='/'
          className='border border-transparent hover:border-b-white transition-all'
        >
          Home
        </Link>
        <Link
          to='/blogs'
          className='border border-transparent hover:border-b-white transition-all'
        >
          Blogs
        </Link>
        <Link
          to='/users'
          className='border border-transparent hover:border-b-white transition-all'
        >
          Users
        </Link>
      </div>
      <div className='flex w-1/3 justify-center text-white'>
        {user ? (
          <span>
            <span>{user.name} logged in </span>
            <button
              className='bg-secondary rounded-md px-3 py-1 hover:brightness-90'
              onClick={handleLogout}
            >
              Log out
            </button>
          </span>
        ) : (
          <span>
            <button
              className='bg-secondary rounded-md px-3 py-1 hover:brightness-90'
              onClick={() => navigate('/login')}
            >
              Log in
            </button>
          </span>
        )}
      </div>
    </nav>
  )
}

export default NavigationBar
