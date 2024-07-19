import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import userService from '../services/users'

const UserDetails = () => {
  const id = useParams().id

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: () => userService.getById(id),
  })

  if (userQuery.isError) {
    return <div>Error fetching data</div>
  }

  if (userQuery.isLoading) {
    return <div>Loading data...</div>
  }

  const user = userQuery.data
  console.log(user)

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserDetails
