const config = require('../../config')
const mongoose = require('mongoose')

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(config.credenciales.MONGOATLAS, advancedOptions)

module.exports = mongoose.model('Users', {
    username: String,
    password: String
})