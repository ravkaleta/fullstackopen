import React, { useState } from 'react'
import diaryService from '../services/diaryService'
import axios from 'axios'
import { NonSensitiveDiaryEntry, Visibility, Weather } from '../types'

interface Props {
  setDiaries: React.Dispatch<React.SetStateAction<NonSensitiveDiaryEntry[]>>
}

const NewDiaryForm = ({ setDiaries }: Props) => {
  const [date, setDate] = useState('')
  const [visibility, setVisibility] = useState('')
  const [weather, setWeather] = useState('')
  const [comment, setComment] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const addDiary = (event: React.SyntheticEvent) => {
    event.preventDefault()
    const newDiary = {
      date,
      visibility,
      weather,
      comment,
    }
    console.log(newDiary)

    diaryService
      .addDiary(newDiary)
      .then((addedDiary) => {
        setDiaries((diaries) => diaries.concat(addedDiary))
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error)) {
          if (
            error?.response?.data &&
            typeof error?.response?.data === 'string'
          ) {
            setErrorMessage(error.response.data)
          } else {
            setErrorMessage('Unrecognized axios error')
          }
        } else {
          setErrorMessage('Unknown error')
          console.log(error)
        }
      })
  }

  return (
    <form onSubmit={addDiary}>
      <h2>Add new entry</h2>
      <h4 style={{ color: 'red' }}>{errorMessage}</h4>
      <div>
        date
        <input
          type='date'
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
      </div>
      <div>
        visibility
        {Object.values(Visibility).map((v) => {
          const value = v.toString()
          return (
            <React.Fragment key={value}>
              <input
                type='radio'
                value={value}
                onChange={({ target }) => setVisibility(target.value)}
                checked={visibility === value}
              />
              {value}
            </React.Fragment>
          )
        })}
      </div>
      <div>
        weather
        {Object.values(Weather).map((v) => {
          const value = v.toString()
          return (
            <React.Fragment key={value}>
              <input
                type='radio'
                value={value}
                onChange={({ target }) => setWeather(target.value)}
                checked={weather === value}
              />
              {value}
            </React.Fragment>
          )
        })}
      </div>
      <div>
        comment
        <input
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
      </div>
      <button type='submit'>add</button>
    </form>
  )
}

export default NewDiaryForm
