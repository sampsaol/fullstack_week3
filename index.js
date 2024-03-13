require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

morgan.token('b-content', (request) => {
  const newBody = { name: request.body.name, number: request.body.number }
  return JSON.stringify(newBody)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :b-content'))
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

let persons = []

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    console.log(count, "hererreer")
    const phoneBookText = `Phonebook has info for ${count} people`
    const date = new Date()[Symbol.toPrimitive]('string')
    response.send(`<p>${phoneBookText}</p> <p>${date}</p>`)

  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then( result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
    }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })

  .catch(error => next(error))
  /* const id = Math.floor(Math.random() * 10000000)
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
  response.json(person) */
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id, 
    { name, number },
    { new: true, runValidators: true, context: 'query'})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})