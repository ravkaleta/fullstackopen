import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../graphql/queries'

const Login = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      props.setError(error.graphQLErrors[0].message)
    },
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      props.setToken(token)
      window.localStorage.setItem('user-token', token)
      props.setPage('authors')
    }
  }, [result.data])

  if (!props.show) {
    return null
  }

  const handleLogin = (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type='text'
          onChange={({ target }) => setUsername(target.value)}
          value={username}
        />
      </div>
      <div>
        password
        <input
          type='password'
          onChange={({ target }) => setPassword(target.value)}
          value={password}
        />
      </div>
      <button type='submit'>log in</button>
    </form>
  )
}

export default Login
