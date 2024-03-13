const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]

const url = 
  `mongodb+srv://fullstack:${password}@fullstack.gqvolcz.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Persons', personSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}
else {
  const nameContent = process.argv[3]
  const numberContent = process.argv[4]

  const person = new Person({
    name: nameContent,
    number: numberContent
  })

  person.save().then(result => {
    console.log(`added ${nameContent} number ${numberContent} to phonebook`)
    mongoose.connection.close()
  })

}



