import React, { useState } from 'react'
import { EntryType, EntryWithoutId, HealthCheckRating } from '../../types'
import { assertNever, isEntryType } from '../../utils'
import patientsService from '../../services/patients'
import axios from 'axios'

interface Props {
  patientId: string
}

const NewEntryForm = ({ patientId }: Props) => {
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [specialist, setSpecialist] = useState('')
  const [diagnosisCode, setDiagnosisCode] = useState('')
  const [diagnoses, setDiagnoses] = useState<string[]>([])

  const [rating, setRating] = useState<number>(0)

  const [dischargeDate, setDischargeDate] = useState('')
  const [dischargeCriteria, setDischargeCriteria] = useState('')

  const [sickLeaveStartDate, setSickLeaveStartDate] = useState('')
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState('')
  const [employerName, setEmployerName] = useState('')

  const [errorMessage, setErrorMessage] = useState('')

  const addDiagnosisCode = () => {
    setDiagnoses(diagnoses.concat(diagnosisCode))
    setDiagnosisCode('')
  }

  const addEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    if (isEntryType(type)) {
      const newEntry: EntryWithoutId = {
        type,
        description,
        date,
        specialist,
        diagnosisCodes: diagnoses,
        healthCheckRating: rating,
        discharge: {
          date: dischargeDate,
          criteria: dischargeCriteria,
        },
        employerName,
        sickLeave: {
          startDate: sickLeaveStartDate,
          endDate: sickLeaveEndDate,
        },
      }

      try {
        const addedEntry = await patientsService.createEntry(
          patientId,
          newEntry
        )

        console.log(addedEntry)
      } catch (error: unknown) {
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
      }
    } else {
      setErrorMessage('Plese select type')
    }
  }

  const typeRelatedFields = () => {
    if (isEntryType(type)) {
      switch (type) {
        case EntryType.HealthCheck:
          return (
            <div>
              Health rating:
              {Object.values(HealthCheckRating)
                .filter((v) => typeof v === 'number')
                .map((v) => (
                  <React.Fragment key={v}>
                    <input
                      type='radio'
                      value={v}
                      onChange={() => setRating(Number(v))}
                      checked={v === rating}
                    />
                    {v}
                  </React.Fragment>
                ))}
            </div>
          )
        case EntryType.Hospital:
          return (
            <>
              <h4>Discharge</h4>
              <div>
                date
                <input
                  value={dischargeDate}
                  onChange={({ target }) => setDischargeDate(target.value)}
                />
              </div>
              <div>
                criteria
                <input
                  value={dischargeCriteria}
                  onChange={({ target }) => setDischargeCriteria(target.value)}
                />
              </div>
            </>
          )
        case EntryType.OccupationalHealthcare:
          return (
            <>
              <div>
                employer name
                <input
                  value={employerName}
                  onChange={({ target }) => setEmployerName(target.value)}
                />
              </div>
              <h4>Sick leave</h4>
              <div>
                start date
                <input
                  value={sickLeaveStartDate}
                  onChange={({ target }) => setSickLeaveStartDate(target.value)}
                />
              </div>
              <div>
                end date
                <input
                  value={sickLeaveEndDate}
                  onChange={({ target }) => setSickLeaveEndDate(target.value)}
                />
              </div>
            </>
          )
        default:
          return assertNever(type)
      }
    }
  }

  return (
    <form onSubmit={addEntry}>
      <h3>new entry</h3>
      <h3 style={{ color: 'red' }}>{errorMessage}</h3>
      <div>
        <p>Entry type: </p>
        {Object.values(EntryType).map((v) => (
          <div key={v}>
            <input
              type='radio'
              value={v}
              onChange={() => setType(v)}
              checked={v === type}
            />
            {v}
          </div>
        ))}
      </div>
      <div>
        description
        <input
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
      </div>
      <div>
        date
        <input
          type='date'
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
      </div>
      <div>
        specialist
        <input
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
      </div>
      <div>
        diagnose code
        <input
          value={diagnosisCode}
          onChange={({ target }) => setDiagnosisCode(target.value)}
        />
        <button type='button' onClick={addDiagnosisCode}>
          add diagnose
        </button>
        {diagnoses.join(', ')}
      </div>
      {typeRelatedFields()}
      <button type='submit'>add entry</button>
    </form>
  )
}

export default NewEntryForm
