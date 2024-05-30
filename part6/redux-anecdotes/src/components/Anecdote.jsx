
const Anecdote = ({anecdote, handleClick}) => {
    console.log('render anec')
    return (
        <div key={anecdote.id}>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={() => handleClick(anecdote)}>vote</button>
            </div>
        </div>
    )
}

export default Anecdote