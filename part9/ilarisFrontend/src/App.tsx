import { useEffect, useState } from 'react'
import diaryService from './services/diaryService'
import { NonSensitiveDiaryEntry } from './types'
import DiaryList from './components/DiaryList'
import NewDiaryForm from './components/NewDiaryForm'

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([])
  useEffect(() => {
    diaryService.getDiaries().then((data) => {
      setDiaries(data)
    })
  }, [])

  return (
    <div>
      <NewDiaryForm setDiaries={setDiaries} />
      <DiaryList diaries={diaries} />
    </div>
  )
}

export default App
