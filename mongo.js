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
  nameContent: String,
  numberContent: String
})

const Person = mongoose.model('Persons', personSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.nameContent, person.numberContent)
    })
    mongoose.connection.close()
  })
}
else {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    nameContent: name,
    numberContent: number
  })

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })

}



