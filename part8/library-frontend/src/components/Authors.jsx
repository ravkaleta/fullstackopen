import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../graphql/queries'
import Select from 'react-select'

const Authors = (props) => {
  const [born, setBorn] = useState('')
  const result = useQuery(ALL_AUTHORS)
  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join('/n')
      props.setError(messages)
      setTimeout(() => {
        props.setError(null)
      }, 2000)
    },
  })

  const [selectedAuthor, setSelectedAuthor] = useState(null)

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors

  const options = authors.map((author) => {
    return { value: author.name, label: author.name }
  })

  const submitUpdate = (event) => {
    event.preventDefault()

    const bornInt = parseInt(born)
    updateAuthor({
      variables: { name: selectedAuthor.value, setBornTo: bornInt },
    })

    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={submitUpdate}>
        <h2>update Author</h2>
        <Select
          defaultValue={selectedAuthor}
          onChange={setSelectedAuthor}
          options={options}
        />
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>updateAuthor</button>
      </form>
    </div>
  )
}

export default Authors
