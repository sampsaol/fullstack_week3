const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

morgan.token('b-content', (request) => {
  const newBody = { name: request.body.name, number: request.body.number }
  return JSON.stringify(newBody)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :b-content'))
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

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
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/info', (request, response) => {
  const phoneBookText = `Phonebook has info for ${persons.length} people`
  const date = new Date()[Symbol.toPrimitive]('string')
  response.send(`<p>${phoneBookText}</p> <p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id == id)

  if (person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const id = Math.floor(Math.random() * 10000000)
  const person = request.body
  person.id = id

  if (!person.name || !person.number) {
    return response.status(400).json({
      error: "content missing"
    })
  }
  if (persons.find(existing => existing.name == person.name)) {
    return response.status(400).json({
      error: "name must be unique"
    })
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})