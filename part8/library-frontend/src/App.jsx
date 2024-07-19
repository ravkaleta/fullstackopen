import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import { useApolloClient, useSubscription } from '@apollo/client'
import Recommend from './components/Recommend'
import { BOOK_ADDED, ALL_BOOKS } from './graphql/queries'

export const updateCache = (cache, query, bookAdded) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(bookAdded)),
    }
  })
}

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const [error, setError] = useState(null)
  const client = useApolloClient()

  console.log(client.cache)

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      updateCache(
        client.cache,
        { query: ALL_BOOKS, variables: { genre: null } },
        data.data.bookAdded
      )
    },
  })

  useEffect(() => {
    const storageToken = localStorage.getItem('user-token')
    if (storageToken) {
      setToken(storageToken)
    }
  }, [])

  const handleLogout = (event) => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        {!token ? (
          <button onClick={() => setPage('login')}>login</button>
        ) : (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={handleLogout}>logout</button>
          </>
        )}
      </div>
      {error && <h3 style={{ color: 'red' }}>{error}</h3>}

      <Login
        show={page === 'login'}
        setToken={setToken}
        setError={setError}
        setPage={setPage}
      />

      <Authors show={page === 'authors'} setError={setError} />

      <Books show={page === 'books'} />

      <Recommend show={page === 'recommend'} token={token} />

      <NewBook show={page === 'add'} setError={setError} />
    </div>
  )
}

export default App
