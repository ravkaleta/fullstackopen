import { EntryType } from './types'

export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  )
}

export const isEntryType = (type: string): type is EntryType => {
  return Object.values(EntryType)
    .map((v) => v.toString())
    .includes(type)
}
