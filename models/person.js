const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3
    },
    number: {
      type: String,
      minlength: 8,
      validate: {
        validator: (number) => {
          return (/\d{2}-\d{5,}/.test(number) || /\d{3}-\d{4,}/.test(number))
        },
        message: props => `${props.value} is not a valid number`
      }
    }
  })

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('persons', personSchema)