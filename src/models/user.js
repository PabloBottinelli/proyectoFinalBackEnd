const mongoose = require('mongoose')

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(process.env.MONGOATLAS, advancedOptions)

module.exports = mongoose.model('Users', {
    username: String,
    password: String
})