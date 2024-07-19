import { calculateBmi } from './utils/calculators'

const a: number = Number(process.argv[2])
const b: number = Number(process.argv[3])
if (process.argv.length - 2 <= 1) {
  console.error('Not enough arguments passed')
} else {
  try {
    console.log(calculateBmi(a, b))
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong'

    if (error instanceof Error) {
      errorMessage += error.message
    }

    console.log(errorMessage)
  }
}
