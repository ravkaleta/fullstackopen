import { apiBaseUrl } from '../constants'
import axios from 'axios'
import { DiagnoseEntry } from '../types'

const getByCode = async (code: string) => {
  const { data } = await axios.get<DiagnoseEntry>(
    `${apiBaseUrl}/diagnoses/${code}`
  )
  return data
}

export default { getByCode }
