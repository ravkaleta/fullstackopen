import patients from '../../data/patients'
import { Entry, EntryWithoutId } from '../types'
import { v1 as uuid } from 'uuid'

const addEntry = (patientIndex: number, object: EntryWithoutId): Entry => {
  const newEntry = {
    id: uuid(),
    ...object,
  }

  patients[patientIndex].entries.push(newEntry)

  return newEntry
}

export default { addEntry }
