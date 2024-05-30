import { useSelector, useDispatch } from "react-redux"
import { voteFor } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"
import Anecdote from "./Anecdote"

const AnecdoteList = () => {
    console.log('render list')

    const anecdotes = useSelector(({anecdotes, filter}) => {
        const filteredAnecdotes = filter === ''
            ? anecdotes
            : anecdotes.filter(anecdote => anecdote.content.includes(filter))

        return [...filteredAnecdotes].sort((a,b) => b.votes - a.votes)
    })

    const dispatch = useDispatch()

    const vote = (anecdote) => {
        dispatch(voteFor(anecdote.id))
        dispatch(setNotification(`you voted '${anecdote.content}'`, 2))
    }

    return (
        <>
            {anecdotes.map(anecdote =>
                <Anecdote key={anecdote.id} anecdote={anecdote} handleClick={vote}/>
            )}
        </>
    )
}

export default AnecdoteList