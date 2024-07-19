import axios from 'axios'
import { DiaryEntry, NewDiaryEntry, NonSensitiveDiaryEntry } from '../types'

const baseUrl = '/api/diaries'

const getDiaries = () => {
  return axios
    .get<NonSensitiveDiaryEntry[]>(baseUrl)
    .then((response) => response.data)
}

const addDiary = (obj: NewDiaryEntry) => {
  return axios.post<DiaryEntry>(baseUrl, obj).then((response) => response.data)
}

export default { getDiaries, addDiary }
