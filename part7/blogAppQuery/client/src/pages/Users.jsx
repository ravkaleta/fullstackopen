import { Routes, Route } from 'react-router-dom'
import UserList from './UserList'
import UserDetails from './UserDetails'

const Users = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<UserList />} />
        <Route path=':id' element={<UserDetails />} />
      </Routes>
    </div>
  )
}

export default Users
