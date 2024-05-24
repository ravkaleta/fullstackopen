const LoginForm = ({username, password,
        handleSumbit, handleUsernameChange, handlePasswordChange
    }) => {


    

    return (
        <form onSubmit={handleSumbit}>
            <div>
            username
            <input
                data-testid='username'
                type="text"
                value={username}
                name={"Username"}
                onChange={handleUsernameChange}
            />
            </div>
            <div>
            password
            <input
                data-testid='password'
                type="password"
                value={password}
                name={"Password"}
                onChange={handlePasswordChange}
            />
            </div>
            <button type="submit">Login</button>
        </form>
  )
}

export default LoginForm
