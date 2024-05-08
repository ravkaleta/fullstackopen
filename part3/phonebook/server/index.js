const cors = require('cors');
const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(express.json());
app.use(cors());
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
    response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);

  if(person) {
    response.send(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id)

  response.status(204).end();
})

const generateId = () => {
  // const maxId = persons.length > 0 
  //   ? Math.max(...persons.map(person => person.id))
  //   : 0;

  // return maxId + 1;

  return Math.floor(Math.random() * 100000);
}

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if(!body.name && !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    })
  }

  if(persons.find(person => person.name === body.name)){
    return response.status(400).json({
      error: "name must be unique"
    })
  }
  
  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(newPerson);
  response.json(newPerson);
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})