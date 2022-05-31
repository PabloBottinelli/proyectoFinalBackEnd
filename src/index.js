const express = require('express')
const session = require("express-session")
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { engine } = require ('express-handlebars')
const { normalize, schema, denormalize } = require('normalizr')
const { ENV: { PORT } } = require('../config');

app.engine('handlebars', engine())
app.set('view engine', 'hbs')
app.set("views", "./views")

/* ------------------ Persistencia Mongo -------------------- */

const MongoStore = require("connect-mongo")
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

let sessionMiddleware = session({
  store: MongoStore.create({
    mongoUrl: process.env.MONGOATLAS,
    mongoOptions: advancedOptions,
  }),
  secret: "shhh",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    maxAge: 60000
  }
})
app.use(sessionMiddleware)

function sessionHandler(req, res, next) { sessionMiddleware(req, res, next) }

const ContenedorArchivo = require('./contenedores/filesContainer.js')
const contenidoMsjs = new ContenedorArchivo('./db/chat.txt')

const { routerProductosTest } = require("./router/productos")
const { routerProductos } = require("./router/productos")
const { routerCarrito } = require("./router/carrito")
const { routerLogin } = require("./router/login")

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded( {extended: true} ))
app.use('/api/productos-test', routerProductosTest)
app.use('/api/productos', routerProductos)
app.use('/api/carrito', routerCarrito)
app.use('/login', sessionHandler, routerLogin)

/* ------------------ Home -------------------- */

app.get('/', sessionHandler,(req, res) => {
  if(req.session.nombre){
    res.sendFile('index.html', { root: './public/home' })
  }else{
    res.redirect('/login')
  }
})

/* ------------------ Logout -------------------- */

app.get('/logout-despedida', (req, res) => {
  res.sendFile('logout.html', { root: './public/login' })
})

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/login')
  })
})

app.get('/login-error', (req, res) => {
  res.sendFile('login-error.html', { root: './public/login' })
})

/* ------------------ Para rutas inexistentes -------------------- */

app.get('*', async (req, res)=>{
  res.json({ error : -2, descripcion: `ruta ${req.path} - método ${req.method} no implementados`})
})

/* ------------------ Chat con Socket y Normalizr -------------------- */

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

  let porcentaje = {
    rate
  }
 
  denorm.push(porcentaje)
  socket.emit('messages', denorm)

  socket.on('message' , msg => {
    contenidoMsjs.save(msg).then(contenidoMsjs.getAll().then(resp => io.sockets.emit('messages', resp)))
  })
})

/* ------------------ Server -------------------- */

const srv = server.listen(PORT, () => { 
  console.log(`Servidor Http con Websockets escuchando en el puerto ${srv.address().port}`);
})
srv.on('error', error => console.log(`Error en servidor ${error}`))