import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../requests"
import { useContext } from "react"
import NotificationContext from "../providers/NotificationContext"

const AnecdoteForm = () => {

    const queryClient = useQueryClient()

    const { notificationDispatch } = useContext(NotificationContext)

    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: (newAnecdote) => {
            const anecdotes = queryClient.getQueryData(['anecdotes'])
            queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
        }, 
        onError: (error) => {
            notificationDispatch({type: "SET", payload: error.response.data.error})
            setTimeout(() => {
                notificationDispatch({type: "RESET"})
            }, 5000)
        }
    })

    const onCreate = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        newAnecdoteMutation.mutate({content, votes: 0})
    }

    return (
        <div>
        <h3>create new</h3>
        <form onSubmit={onCreate}>
            <input name='anecdote' />
            <button type="submit">create</button>
        </form>
        </div>
    )
    }

export default AnecdoteForm
