export const calculateBmi = (heightCM: number, weightKG: number): string => {
  if (heightCM === 0) throw new Error("Height can't be 0!")
  const BMI = weightKG / Math.pow(heightCM / 100, 2)
  switch (true) {
    case BMI < 18.5:
      return 'Underweight'
    case BMI >= 18.5 && BMI < 25:
      return 'Normal (healthy weight)'
    case BMI >= 25:
      return 'Overweight'
    default:
      return ''
  }
}

interface Result {
  periodLength: number
  trainingDays: number
  success: boolean
  rating: number
  ratingDescription: string
  target: number
  average: number
}

type Rating = {
  points: number
  description: string
}

const TARGET_OFFSET = 0.25

const getRating = (average: number, target: number, offset: number): Rating => {
  switch (true) {
    case average < target - offset:
      return {
        points: 1,
        description: 'you need to exercise more',
      }
    case target - offset < average && average < target:
      return {
        points: 2,
        description: 'not too bad but could be better',
      }
    case average >= target:
      return {
        points: 3,
        description: 'you are doing great!',
      }
    default:
      return {
        points: 0,
        description: '',
      }
  }
}

export const calculateExercise = (
  target: number,
  trainingsTime: number[]
): Result => {
  const periodLength = trainingsTime.length
  const trainingDays = trainingsTime.reduce(
    (acc, curr) => acc + (curr > 0 ? 1 : 0),
    0
  )
  const average =
    trainingsTime.reduce((acc, curr) => acc + curr, 0) / periodLength
  const success = average >= target
  const rating = getRating(average, target, TARGET_OFFSET)
  return {
    periodLength,
    trainingDays,
    success,
    rating: rating.points,
    ratingDescription: rating.description,
    target,
    average,
  }
}
