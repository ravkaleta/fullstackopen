require('dotenv').config();
const express = require('express');
const app = express();
const Person = require('./models/person');
const cors = require('cors');
const morgan = require('morgan');

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
})

const morganLogger = morgan((tokens, req, res) => {
  return [
    tokens.method(req,res),
    tokens.url(req,res),
    tokens.status(req,res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req,res), 'ms',
    tokens.body(req,res)
  ].join(' ')
})

app.use(morganLogger);

let persons = [
    { 
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456"
      },
      { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523"
      },
      { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345"
      },
      { 
        id: 4,
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
      }
]

app.get('/info', (request, response) => {
  const requestReceivedTime = new Date();

  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${requestReceivedTime}</p>
  `)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    response.json(person);
  })
  .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {

  Person.findByIdAndDelete(request.params.id)
    .then(result => {
       response.status(204).end();
    })
    .catch(error => next(error))
})

const generateId = () => {
  // const maxId = persons.length > 0 
  //   ? Math.max(...persons.map(person => person.id))
  //   : 0;

  // return maxId + 1;

  return Math.floor(Math.random() * 100000);
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if(!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson);
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    {new: true, runValidators: true, context: 'query'}
  )
    .then(updatedPerson => {
       response.json(updatedPerson);
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.log(error);
  if(error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  } else if(error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }

  next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})