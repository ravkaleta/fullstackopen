import { EntryType, Gender, HealthCheckRating } from '../types'

export const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String
}

export const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date))
}

export const isGender = (gender: string): gender is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(gender)
}

export const isEntryType = (type: string): type is EntryType => {
  return Object.values(EntryType)
    .map((v) => v.toString())
    .includes(type)
}

export const isHealthCheckRating = (
  rating: number
): rating is HealthCheckRating => {
  return Object.values(HealthCheckRating)
    .filter((value): value is number => typeof value === 'number')
    .includes(rating)
}

export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  )
}
