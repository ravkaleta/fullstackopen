import { useEffect, useState } from 'react'
import diagnosesService from '../../services/diagnoses'
import { Entry, DiagnoseEntry } from '../../types'
import { assertNever } from '../../utils'

interface Props {
  entry: Entry
}

const EntryDetails = ({ entry }: Props) => {
  const [diagnoses, setDiagnoses] = useState<DiagnoseEntry[]>([])

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const fetchedDiagnoses = await Promise.all(
        entry.diagnosisCodes?.map((code) => diagnosesService.getByCode(code)) ||
          []
      )
      setDiagnoses(fetchedDiagnoses)
    }

    fetchDiagnoses()
  }, [])

  const extraDetails = () => {
    switch (entry.type) {
      case 'Hospital':
        return (
          <>
            <h3>Discharge</h3>
            <p>date {entry.discharge.date}</p>
            <p>criteria {entry.discharge.criteria}</p>
          </>
        )
      case 'HealthCheck':
        return <p>Healthcheck rating: {entry.healthCheckRating}</p>
      case 'OccupationalHealthcare':
        return (
          <>
            <p>employer name: {entry.employerName}</p>
            <p>sick leave:</p>
            <p>start: {entry.sickLeave?.startDate}</p>
            <p>end: {entry.sickLeave?.endDate}</p>
          </>
        )
      default:
        return assertNever(entry)
    }
  }

  return (
    <>
      <p>
        {entry.date} {entry.description}
      </p>
      <p>{entry.type}</p>
      <ul>
        {diagnoses.map((diagnose) => (
          <li key={diagnose.code}>
            {diagnose.code} {diagnose.name}
          </li>
        ))}
        <p>diagnose by {entry.specialist}</p>
      </ul>
      {extraDetails()}
    </>
  )
}

export default EntryDetails
