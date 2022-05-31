const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(process.env.MONGOATLAS, advancedOptions)

const usuariosCollection = 'usuarios'

const UsuarioSchema = new mongoose.Schema({
    username: String,
    password: String,
})

UsuarioSchema.plugin(passportLocalMongoose)

const usuarioModel = mongoose.model(usuariosCollection, UsuarioSchema)

module.exports = { usuarioModel }
