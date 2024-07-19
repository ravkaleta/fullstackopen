import express from 'express'
import patientService from '../services/patientService'
import toNewPatientEntry from '../utils/patientParser'
import toNewEntry from '../utils/entryParser'
import entriesService from '../services/entriesService'

const router = express.Router()

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveEntries())
})

router.get('/:id', (req, res) => {
  try {
    const patient = patientService.getPatient(req.params.id)
    res.json(patient)
  } catch (error) {
    let errorMessage = 'Something went wrong. '
    if (error instanceof Error) {
      errorMessage += error.message
    }
    res.status(400).send(errorMessage)
  }
})

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatientEntry(req.body)

    const addedPatient = patientService.addEntry(newPatient)
    res.json(addedPatient)
  } catch (error) {
    let errorMessage = 'Something went wrong. '
    if (error instanceof Error) {
      errorMessage += error.message
    }

    res.status(400).send(errorMessage)
  }
})

router.post('/:id/entries', (req, res) => {
  try {
    const patientIndex = patientService.getPatientIndex(req.params.id)
    console.log(patientIndex)
    const newEntry = toNewEntry(req.body)
    const addedEntry = entriesService.addEntry(patientIndex, newEntry)

    res.json(addedEntry)
  } catch (error) {
    let errorMessage = 'Something went wrong. '
    if (error instanceof Error) {
      errorMessage += error.message
    }

    res.status(400).send(errorMessage)
  }
})

export default router
