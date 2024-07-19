import { CoursePart } from '../types'
import { assertNever } from '../utils'

const Part = ({ part }: { part: CoursePart }) => {
  const courseAttributes = () => {
    switch (part.kind) {
      case 'basic':
        return <p>{part.description}</p>
      case 'group':
        return <p>project exercises{part.groupProjectCount}</p>
      case 'background':
        return (
          <>
            <p>{part.description}</p>
            <p>submit to {part.backgroundMaterial}</p>
          </>
        )
      case 'special':
        return (
          <>
            <p>{part.description}</p>
            <p>required: {part.requirements.join(', ')}</p>
          </>
        )
      default:
        return assertNever(part)
    }
  }

  return (
    <div>
      <h2>
        {part.name} {part.exerciseCount}
      </h2>
      {courseAttributes()}
    </div>
  )
}

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <div>
      {courseParts.map((part) => (
        <Part part={part} />
      ))}
    </div>
  )
}

export default Content
