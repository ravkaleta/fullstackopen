import { useEffect, useState } from 'react'
import personService from './services/persons'
import axios from 'axios'
import './index.css'

const Filter = ({nameFilterValue, handleFilterNameChange}) => {

  return(
    <div>
      filter shown with
      <input value={nameFilterValue} onChange={handleFilterNameChange}/>
    </div>
  )
}

const PersonForm = ({nameValue, numberValue, handleNameChange, handleNumberChange, handleSubmit}) => {

  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input onChange={handleNameChange} value={nameValue}/>
      </div>
      <div>
        number: <input onChange={handleNumberChange} value={numberValue}/>
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
     </form>
  )
}

const Persons = ({persons, nameFilter, removePerson}) => {

  return (
    <ul>
      {persons.map(person => 
        (!nameFilter || person.name.toLowerCase().includes(nameFilter)) 
          ? <Person key={person.id} person={person} removePerson={removePerson}/> 
          : null
      )}
    </ul>
  )
}

const Person = ({person, removePerson}) => {

  return(
    <li>
      {person.name} {person.number}
      <button onClick={() => removePerson(person)}>delete</button>
    </li>
  )
}

const NotificationMessage = ({message}) => {

  if(message === null){
    return null
  }

  if(message.type === 'error'){
    return (
      <div className='notification error'>
        {message.text}
      </div>
    )
  }

  if(message.type === 'success'){
    return (
      <div className='notification success'>
        {message.text}
      </div>
    )
  }
  
} 

const App = () => {
  const [persons, setPersons] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
        console.log(initialPersons)
      })
  }, [])

  const [nameFilter, setNameFilter] = useState('');

  const onNameFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  const onNameChange = (event) => {
    setNewName(event.target.value)
  }

  const onNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addNewPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    }

    const existingPerson = persons.find(person => person.name === newName);
    console.log(existingPerson)

    if(existingPerson) {
      if(confirm(`${existingPerson.name} is already in the phonebook, replace the old number with a new one`)){
        personService.update(existingPerson.id, newPerson).then(updatedPerson => {
          setPersons(persons.map(person => person.id !== existingPerson.id ? person : updatedPerson))
          setNotificationMessage({
            type: 'success',
            text: `${updatedPerson.name} number updated`
          });
          setTimeout(() => {
            setNotificationMessage(null);
          }, 2000)
        })
        .catch(error => {
          setNotificationMessage({
            type: 'error',
            text: `${existingPerson.name} has been already removed from the server`
          })
          setTimeout(() => {
            setNotificationMessage(null);
          }, 2000)
        })
      }
    } else {
      personService.create(newPerson).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNotificationMessage({
          type: 'success',
          text: `Added ${returnedPerson.name}`
        });
        setTimeout(() => {
          setNotificationMessage(null);
        }, 2000)
      })
    }
  }

  const removePerson = (person) => {
    if(confirm(`Do you really want to remove ${person.name} from the phonebook?`)){
      personService.remove(person.id)
      .then(returnedPerson => {
        setPersons(persons.filter(person => person.id !== returnedPerson.id))
      })
      .catch(error => {
        setNotificationMessage({
          type: 'error',
          text: `${person.name} has been already removed from the server`
        })
        setTimeout(() => {
          setNotificationMessage(null);
        }, 2000)
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <NotificationMessage message={notificationMessage}/>
      <Filter 
        nameFilterValue={nameFilter} 
        handleFilterNameChange={onNameFilterChange}
      />
      <h2>Add a new</h2>
      <PersonForm 
        nameValue={newName} 
        numberValue={newNumber} 
        handleNameChange={onNameChange} 
        handleNumberChange={onNumberChange} 
        handleSubmit={addNewPerson}
      />
      <h2>Numbers</h2>
      <Persons 
        persons={persons} 
        nameFilter={nameFilter} 
        removePerson={removePerson}
      />
    </div>
  )
}

export default App
