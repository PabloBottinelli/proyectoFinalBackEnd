const fs = require('fs')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const Contenedor = require('./contenedores/contenedorProductos.js')
var contenido = new Contenedor()
const { engine } = require ('express-handlebars')
const { normalize, schema, denormalize } = require('normalizr')

app.engine('handlebars', engine())
app.set('view engine', 'hbs')
app.set("views", "./views")

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded( {extended: true} ))

const ContenedorArchivo = require('./contenedores/filesContainer.js')
const contenidoMsjs = new ContenedorArchivo('./db/chat.txt')


const authorNormalizerSchema = new schema.Entity('author',{},{ idAttribute: 'mail' })
const textNormalizerSchema = new schema.Entity('text',{author: authorNormalizerSchema}, {idAttribute: 'id'} )
const messagesNormalizerSchema = [textNormalizerSchema]

async function normalizarMsgs(){
  const msgs = await contenidoMsjs.getAll()
  const normalizado = normalize(msgs, messagesNormalizerSchema, {idAttribute: 'email'})

  return JSON.stringify(normalizado)
} 

async function denormalizar(msgs){
  const mensajesNormalizados = JSON.parse(msgs)
  const mensajes = denormalize(mensajesNormalizados.result,messagesNormalizerSchema, mensajesNormalizados.entities)
  return mensajes
}


io.on('connection', async socket => {
  console.log('Nuevo cliente conectado')

  const mensajes = await normalizarMsgs()
  const longNorm = mensajes.length
  const denorm = await denormalizar(mensajes)
  const longSinNorm = JSON.stringify(denorm).length
  const porcentajeC = (longNorm * 100) / longSinNorm
  let rate = porcentajeC.toFixed(2)

  denorm.porcentaje = rate
  console.log(denorm.porcentaje)
  socket.emit('messages', denorm)

  // contenidoMsjs.getAll().then(resp => socket.emit('messages', resp))

  socket.on('message' , msg => {
    contenidoMsjs.save(msg).then(contenidoMsjs.getAll().then(resp => io.sockets.emit('messages', resp)))
  })
})

const PORT = process.env.PORT || 8080;

const srv = server.listen(PORT, () => { 
  console.log(`Servidor Http con Websockets escuchando en el puerto ${srv.address().port}`);
})
srv.on('error', error => console.log(`Error en servidor ${error}`))