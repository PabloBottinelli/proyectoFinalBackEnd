const express = require('express')
const session = require("express-session")
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { engine } = require ('express-handlebars')
const { normalize, schema, denormalize } = require('normalizr')
const { Router } = express
const adm = require('./middleware/middleware.js')
const { ENV: { PORT } } = require('../config');
const { faker } = require('@faker-js/faker')

const MongoStore = require("connect-mongo")
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

app.engine('handlebars', engine())
app.set('view engine', 'hbs')
app.set("views", "./views")

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

const { ProductsDao } = require('./daos/index')
const contenidoProductos = new ProductsDao()

const { CartsDao } = require('./daos/index')
const contenidoCarritos = new CartsDao()

const ContenedorArchivo = require('./contenedores/filesContainer.js')
const contenidoMsjs = new ContenedorArchivo('./db/chat.txt')

const routerProductos = Router()
const routerCarrito = Router()
const routerProductosTest = Router()
const routerLogin = Router()
const routerRegister = Router()

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded( {extended: true} ))
app.use('/api/productos-test', routerProductosTest)
app.use('/api/productos', routerProductos)
app.use('/api/carrito', routerCarrito)
app.use('/login', sessionHandler, routerLogin)
app.use('/register', sessionHandler, routerRegister)

const usuarios = [{nombre: 'pablo'}]

// Login
routerLogin.get('/user', (req, res) => {
  const usuario = usuarios.find(usuario => usuario.nombre == req.session.nombre)
  if (!usuario) {
    res.json("No se encontro usuario logueado")
  }
  res.json({nombre: usuario.nombre})
})

routerLogin.get('/', (req, res) => {
  res.sendFile('login.html', { root: './public/login' })
})

routerLogin.post('/', (req, res) => {
  const { nombre } = req.body
  const usuario = usuarios.find(usuario => usuario.nombre == nombre)
  if (!usuario) {
    return res.redirect('login-error')
  }
  req.session.nombre = nombre
  res.redirect("/")
})

// Home
app.get('/', sessionHandler,(req, res) => {
  if(req.session.nombre){
    res.sendFile('index.html', { root: './public/home' })
  }else{
    res.redirect('/login')
  }
})

// Logout
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

// Rutas Productos
let id = 1
function getId(){
  return id++
}

routerProductosTest.get('/', async (req, res) => {
  let productos = []
    
  for (let index = 0; index < 5; index++) {
    productos.push({
      id: getId(),
      title: faker.commerce.productName(),
      price: faker.commerce.price(),
      thumbnail: faker.image.image()
    })
  }
 
  res.json(productos)
})

routerProductos.get('/:id?', async (req, res) => {
  if(req.params.id){
    contenidoProductos.getById(req.params.id).then(resp => res.send(resp))
  }else{
    contenidoProductos.getAll().then(resp => res.send(resp))
  }
})

routerProductos.post('/', adm, async (req, res) => {
  contenidoProductos.save(req.body).then(resp => res.json(resp))
})

routerProductos.delete('/:id', adm, async (req, res) => {
  contenidoProductos.deleteById(req.params.id).then(resp => res.json(resp))
})

routerProductos.put('/:id', adm, async (req, res) => {
  contenidoProductos.changeById(req.params.id, req.body).then(resp => res.json(resp))
})

// Rutas Carritos

routerCarrito.get('/', async (req, res) => {
  contenidoCarritos.getAll().then(resp => res.send(resp))
})

routerCarrito.get('/:id/productos', async (req, res) => {
  contenidoCarritos.getProducts(req.params.id).then(resp => res.send(resp))
})

routerCarrito.post('/', async (req, res) => {
  contenidoCarritos.save(req.body).then(resp => res.send(resp))
})

routerCarrito.post('/:id/productos', async (req, res) => {
  contenidoProductos.getById(req.body.id_prod).then(resp => resp.error ? res.json(resp) : contenidoCarritos.addProduct(req.params.id, resp).then(resp => res.json(resp)))
})

routerCarrito.delete('/:id', async (req, res) => {
  contenidoCarritos.deleteById(req.params.id).then(resp => res.json(resp))
})

routerCarrito.delete('/:id/productos/:id_prod', async (req, res) => {
  contenidoProductos.getById(req.params.id_prod).then(resp => resp.error ? res.json(resp) : contenidoCarritos.deleteProduct(req.params.id, resp).then(resp => res.json(resp)))
})

app.get('*', async (req, res) => {
  res.json({ error : -2, descripcion: `ruta ${req.path} - método ${req.method} no implementados`})
})


// Chat con Socket y Normalizr

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

const srv = server.listen(PORT, () => { 
  console.log(`Servidor Http con Websockets escuchando en el puerto ${srv.address().port}`);
})
srv.on('error', error => console.log(`Error en servidor ${error}`))