import { useState } from 'react'

const StatisticsLine = ({text, value}) => {
  return (
    <>
      <td>{text}</td>
      <td>{value}</td>
    </>
  )
}

const Statistics = ({good, bad, neutral}) => {
  const total = good + bad + neutral;

  if (total === 0) {
    return <p>No feedback given</p>
  }

  const average = (good - bad)/total;
  const positivePercent = good/total * 100 + '%';
  
  return (
    <>
      <h1>statistics</h1>
      <table>
        <tbody>
          <tr>
            <StatisticsLine text='good' value={good}/>
          </tr>
          <tr>
            <StatisticsLine text='neutral' value={neutral}/>
          </tr>
          <tr>
            <StatisticsLine text='bad' value={bad}/>
          </tr>
          <tr>
            <StatisticsLine text='all' value={total}/>
          </tr>
          <tr>
            <StatisticsLine text='average' value={average}/>
          </tr>
          <tr>
            <StatisticsLine text='positive' value={positivePercent}/>
          </tr>
        </tbody>
      </table>
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  console.log(good, bad, neutral)

  const total = good + bad + neutral;

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>
      <Statistics good={good} bad={bad} neutral={neutral}/>
    </div>
  )
}

export default App
