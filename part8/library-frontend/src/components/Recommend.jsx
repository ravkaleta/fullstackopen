import { useQuery } from '@apollo/client'
import { ALL_BOOKS, USER_DATA } from '../graphql/queries'
import { useState, useEffect } from 'react'

const Recommend = (props) => {
  const [favoriteGenre, setFavoriteGenre] = useState(null)
  const userDataResult = useQuery(USER_DATA, { skip: !props.token })
  const result = useQuery(ALL_BOOKS, {
    skip: !favoriteGenre,
    variables: { genre: favoriteGenre },
  })

  useEffect(() => {
    if (userDataResult.data)
      setFavoriteGenre(userDataResult.data.me.favoriteGenre)
  }, [userDataResult.data])

  if (!props.show) {
    return null
  }

  if (result.loading || userDataResult.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
              <td>{b.genres.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
