import { DiagnoseEntry } from '../types'
import diagnoses from '../../data/diagnoses'

const getEntries = (): DiagnoseEntry[] => {
  return diagnoses
}

const getByCode = (code: string): DiagnoseEntry | undefined => {
  return diagnoses.find((d) => d.code === code)
}

export default { getEntries, getByCode }
