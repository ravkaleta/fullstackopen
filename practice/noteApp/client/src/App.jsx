import { useDebugValue, useEffect, useRef, useState } from 'react'
import noteService from './services/notes'
import loginService from './services/login'
import LoginForm from './components/LoginForm';
import NoteForm from './components/NoteForm';
import Togglable from './components/Togglable';
import Note from './components/Note';

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
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const noteFormRef = useRef()

  useEffect(() => {
    console.log('effect');
    noteService
    .getAll()
    .then(initialNotes => {
      console.log('promise fulfilled');
      setNotes(initialNotes);
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token) 
    }
  },[])

  const notesToShow = showAll 
    ? notes
    : notes.filter(note => note.important);


  const createNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService.create(noteObject).then(returnedNote => {
      setNotes(notes.concat(returnedNote));
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

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)
      setPassword('')
      setUsername('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    noteService.setToken(null)
    setUser(null)
  }

  const handleUsernameChange = ({target}) => {
    setUsername(target.value)
  }

  const handlePasswordChange = ({target}) => {
    setPassword(target.value)
  }

  return (
    <div>
      <h1>Notes</h1>
      <p>Note app, Department of Computer Science, University of Helsinki 2024</p>
      <Notification message={errorMessage} />

      {user === null 
        ? <Togglable buttonLabel="log in">
            <LoginForm 
              username={username}
              password={password}
              handleSumbit={handleLogin}
              handleUsernameChange={handleUsernameChange}
              handlePasswordChange={handlePasswordChange}
            />
          </Togglable>
        : <div>
            <p>{user.name} logged</p>
            <Togglable buttonLabel="new note" ref={noteFormRef}>
              <NoteForm
                createNote={createNote}
              />
            </Togglable>
            <button onClick={handleLogout}>Log out</button>
          </div>}
      
      
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
      
    </div>
  )
}

export default App
