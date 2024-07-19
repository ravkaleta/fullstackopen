import { calculateExercise } from './utils/calculators'

if (process.argv.length - 2 <= 1) {
  console.error('Not enough arguments passed')
} else {
  const target: number = Number(process.argv[2])
  const hoursTrained: number[] = process.argv.slice(3).map((arg) => Number(arg))

  console.log(calculateExercise(target, hoursTrained))
}
