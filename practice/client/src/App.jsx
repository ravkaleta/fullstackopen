import { useEffect, useState } from 'react'
import axios from 'axios'
import noteService from './services/notes'

const Note = ({note, toggleImportance}) => {

  const label = note.important
    ? 'make not important' 
    : 'make important';

  return (
    <li className='note'>
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

const Notification = ({ message }) => {
  if(message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const App = () => {

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    console.log('effect');
    noteService
    .getAll()
    .then(initialNotes => {
      console.log('promise fulfilled');
      setNotes(initialNotes);
    })
  }, [])

  const notesToShow = showAll 
    ? notes
    : notes.filter(note => note.important);


  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    noteService.create(noteObject).then(returnedNote => {
      setNotes(notes.concat(returnedNote));
      setNewNote('');
    })

  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(note => note.id === id);
    const changedNote = {...note, important: !note.important}

    noteService.update(id, changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote));
    })
    .catch(error => {
      setErrorMessage(`Note ${note.content} was already removed from server`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    })

  }

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
         <Note 
            key={note.id} 
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote} 
          onChange={handleNoteChange}
        />
        <button type='submit'>save</button>
      </form>
    </div>
  )
}

export default App
