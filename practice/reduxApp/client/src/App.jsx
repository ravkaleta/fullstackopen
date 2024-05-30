import { useEffect } from 'react'
import NewNote from './components/NewNote'
import Notes from './components/Notes'
import VisibilityFilter from './components/VisibilityFilter'
import { useDispatch } from 'react-redux'
import { initializeNotes, setNotes } from './reducers/noteReducer'
import noteService from './services/notes'

const App = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(initializeNotes())
    }, [])

    return (
        <div>
        <NewNote />
        <VisibilityFilter />
        <Notes />
        </div>
    )
}

export default App