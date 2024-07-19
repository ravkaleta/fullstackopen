import patients from '../../data/patients'
import { v1 as uuid } from 'uuid'
import {
  NewPatientEntry,
  NonSensitivePatientEntry,
  PatientEntry,
} from '../types'

const getEntries = (): PatientEntry[] => {
  return patients
}

const getPatient = (id: string): PatientEntry => {
  const patient = patients.find((p) => p.id === id)
  if (!patient) {
    throw new Error("Could't find patient with that id")
  }
  return patient
}

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }))
}

const getPatientIndex = (id: string): number => {
  const patientIndex = patients.findIndex((p) => p.id === id)

  if (patientIndex === -1) {
    throw new Error("There's no patient with that id")
  }

  return patientIndex
}

const addEntry = (object: NewPatientEntry): PatientEntry => {
  const newEntry = {
    id: uuid(),
    ...object,
    entries: [],
  }

  patients.push(newEntry)
  return newEntry
}

export default {
  getEntries,
  getNonSensitiveEntries,
  addEntry,
  getPatient,
  getPatientIndex,
}
