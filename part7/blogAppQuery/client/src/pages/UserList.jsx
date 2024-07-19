import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'
import { Link } from 'react-router-dom'

const UserList = () => {
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  if (usersQuery.isError) {
    return <div>Error while fetching users</div>
  }

  if (usersQuery.isLoading) {
    return <div>Loading data...</div>
  }

  const users = usersQuery.data

  console.log(users)

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`${user.id}`}>{user.name} </Link>
              </td>
              <td>{user.blogs.length} </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList
