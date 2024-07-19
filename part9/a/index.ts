import express from 'express'
import { calculateBmi, calculateExercise } from './utils/calculators'
const app = express()

app.use(express.json())

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!')
})

app.get('/bmi', (req, res) => {
  interface BodyData {
    weight: number
    height: number
    bmi: string
  }

  const weight = Number(req.query.weight)
  const height = Number(req.query.height)

  if (!weight || !height) {
    res.status(400).json({ error: 'malformatted parameters' })
  }

  const bodyData: BodyData = {
    weight,
    height,
    bmi: calculateBmi(Number(height), Number(weight)),
  }
  res.json(bodyData)
})

app.post('/bmi', (req, res) => {
  interface Request {
    daily_exercises: number[]
    target: number
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body as Request

  if (!target || isNaN(Number(target))) {
    res.status(400).send({ error: 'target not provided or is not a number' })
  }

  if (!daily_exercises || !Array.isArray(daily_exercises)) {
    res
      .status(400)
      .send({ error: 'daily_exercises is not provided or is not an array' })
  }

  if (!daily_exercises.every((ex) => !isNaN(Number(ex)))) {
    res
      .status(400)
      .send({ error: 'daily_exercises contains non-numeric values' })
  }

  const result = calculateExercise(Number(target), daily_exercises)
  res.json(result)
})

const PORT = 3003

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`)
})
