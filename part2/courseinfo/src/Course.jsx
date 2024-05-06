const Header = (props) => {
  
    return (
      <h2>{props.course}</h2>
    )
  }
  
const Content = ({parts}) => {

return (
    <>
    {parts.map((part) =>
        <Part key={part.id} part={part}/>
    )}
    </>
)
}

const Part = ({part}) => {
return (
    <p>{part.name} {part.exercises}</p>
)
}

const Total = ({parts}) => {
return (
    <p><b>total of {parts.reduce((acc, part) => acc + part.exercises, 0)} exercises</b></p>
)
}

const Course = ({course}) => {

    return (
      <div>
        <Header course={course.name}/>
        <Content parts={course.parts}/>
        <Total parts={course.parts}/>
      </div>
    )
  }

  export default Course;

