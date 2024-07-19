import { DiagnoseEntry, EntryType, EntryWithoutId } from '../types'
import {
  assertNever,
  isDate,
  isEntryType,
  isHealthCheckRating,
  isString,
} from './typeCheck'

const toNewEntry = (obj: unknown): EntryWithoutId => {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Incorrect or missing data')
  }

  if (
    'description' in obj &&
    'date' in obj &&
    'specialist' in obj &&
    'type' in obj
  ) {
    const entryType = parseType(obj.type)
    const baseEntry = {
      description: parseDescription(obj.description),
      date: parseDate(obj.date),
      specialist: parseSpecialist(obj.specialist),
      diagnosisCodes: parseDiagnosisCodes(
        'diagnosisCodes' in obj ? obj.diagnosisCodes : null
      ),
    }

    switch (entryType) {
      case EntryType.Hospital:
        if ('discharge' in obj) {
          return {
            ...baseEntry,
            type: entryType,
            discharge: parseDischarge(obj.discharge),
          }
        }
        throw new Error('Missing discharge in entry')
      case EntryType.HealthCheck:
        if ('healthCheckRating' in obj) {
          return {
            ...baseEntry,
            type: entryType,
            healthCheckRating: parseHealthCheckRating(obj.healthCheckRating),
          }
        }
        throw new Error('Missing health check rating in entry')
      case EntryType.OccupationalHealthcare:
        if ('employerName' in obj) {
          const OccupationalHealthcareEntry: EntryWithoutId = {
            ...baseEntry,
            type: entryType,
            employerName: parseEmployerName(obj.employerName),
          }

          if ('sickLeave' in obj) {
            const sickLeave = parseSickLeave(obj.sickLeave)
            if (sickLeave) {
              OccupationalHealthcareEntry.sickLeave = sickLeave
            }
          }
          return OccupationalHealthcareEntry
        }
        throw new Error('Missing employer name in entry')
      default:
        return assertNever(entryType)
    }
  }

  throw new Error('Incorrect data: some fields are missing')
}

const parseType = (type: unknown): EntryType => {
  if (!type || !isString(type) || !isEntryType(type)) {
    throw new Error('Incorrect type: ' + type)
  }
  return type
}

const parseDescription = (descriptrion: unknown): string => {
  if (!descriptrion || !isString(descriptrion)) {
    throw new Error('Incorrect description: ' + descriptrion)
  }
  return descriptrion
}

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect date: ' + date)
  }
  return date
}

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error('Incorrect specialist: ' + specialist)
  }
  return specialist
}

const parseDiagnosisCodes = (
  diagnosisCodes: unknown
): Array<DiagnoseEntry['code']> => {
  if (!diagnosisCodes) {
    return [] as Array<DiagnoseEntry['code']>
  }
  return diagnosisCodes as Array<DiagnoseEntry['code']>
}

const parseHealthCheckRating = (rating: unknown): number => {
  if (
    rating === null ||
    isNaN(Number(rating)) ||
    !isHealthCheckRating(Number(rating))
  ) {
    throw new Error('Incorrect or missing rating: ' + rating)
  }
  return Number(rating)
}

const parseDischarge = (
  discharge: unknown
): { date: string; criteria: string } => {
  if (!discharge || typeof discharge !== 'object') {
    throw new Error('Incorrect or missing data in discharge')
  }
  if (!('date' in discharge)) {
    throw new Error('Missing date in discharge')
  }
  if (!discharge.date || !isString(discharge.date) || !isDate(discharge.date)) {
    throw new Error('Incorrect date in discharge: ' + discharge.date)
  }
  if (!('criteria' in discharge)) {
    throw new Error('Missing criteria in discharge')
  }
  if (!discharge.criteria || !isString(discharge.criteria)) {
    throw new Error('Incorrect criteria in discharge: ' + discharge.criteria)
  }
  return discharge as { date: string; criteria: string }
}

const parseSickLeave = (
  sickLeave: unknown
): { startDate: string; endDate: string } | null => {
  if (
    !sickLeave ||
    typeof sickLeave !== 'object' ||
    !('startDate' in sickLeave || 'endDate' in sickLeave)
  ) {
    return null
  }
  if (!('startDate' in sickLeave)) {
    throw new Error('Missing start date')
  }
  if (
    !sickLeave.startDate ||
    !isString(sickLeave.startDate) ||
    !isDate(sickLeave.startDate)
  ) {
    throw new Error('Incorrect start date in sickLeave: ' + sickLeave.startDate)
  }
  if (!('endDate' in sickLeave)) {
    throw new Error('Missing end date')
  }
  if (
    !sickLeave.endDate ||
    !isString(sickLeave.endDate) ||
    !isDate(sickLeave.endDate)
  ) {
    throw new Error('Incorrect end date in sickLeave: ' + sickLeave.endDate)
  }

  return sickLeave as { startDate: string; endDate: string }
}

const parseEmployerName = (employerName: unknown): string => {
  if (!employerName || !isString(employerName)) {
    throw new Error('Incorrect or missing employer name: ' + employerName)
  }

  return employerName
}

export default toNewEntry
