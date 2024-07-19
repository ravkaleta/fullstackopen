import { useParams } from 'react-router-dom'
import patientsService from '../../services/patients'
import { useEffect, useState } from 'react'
import { Patient } from '../../types'
import EntryDetails from './EntryDetails'
import NewEntryForm from './NewEntryForm'

const PatientDetails = () => {
  const [patient, setPatient] = useState<Patient | null>(null)
  const { id } = useParams()

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (typeof id === 'string') {
        const foundPatient = await patientsService.findById(id)
        setPatient(foundPatient)
      }
    }

    fetchPatientDetails()
  }, [])

  if (!patient) {
    return <div>Patient doesn't exist</div>
  }

  return (
    <div>
      <NewEntryForm patientId={patient.id} />
      <h2>{patient.name}</h2>
      <p>{patient.dateOfBirth}</p>
      <p>{patient.gender}</p>
      <p>{patient.occupation}</p>
      <h3>entries</h3>
      <ul>
        {patient.entries?.map((entry) => (
          <li key={entry.id}>
            <EntryDetails entry={entry} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PatientDetails
