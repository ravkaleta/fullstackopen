import { useState } from "react"

const LoginForm = ({login}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const loginSubmit = (event) => {
        event.preventDefault()
        const credentials = {
            username,
            password
        }
        
        login(credentials)
        setUsername('')
        setPassword('')
    } 

    return (
        <form onSubmit={loginSubmit} data-testid='loginForm'>
            <h1>Log in to application</h1>
            <div>
                username
                <input
                data-testid='username'
                type="text"
                value={username}
                name="Username"
                onChange={({target}) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                data-testid='password'
                type="password"
                value={password}
                name="Password"
                onChange={({target}) => setPassword(target.value)}
                />
            </div>
            <button type="submit">Login</button>
        </form>
    )
}

export default LoginForm