const express = require('express')
const app = express()
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const server = new HttpServer(app)
const io = new IOServer(server)
const { Router } = express
const adm = require('./middleware/middleware.js')
const { engine } = require ('express-handlebars')
const { ENV: { PORT } } = require('../config');
const { faker } = require('@faker-js/faker')
const { normalize, schema } = require('normalizr')

app.engine('handlebars', engine())
app.set('view engine', 'hbs')
app.set("views", "./views")

const { ProductsDao } = require('./daos/index')
const contenidoProductos = new ProductsDao()

const { CartsDao } = require('./daos/index')
const contenidoCarritos = new CartsDao()

const ContenedorArchivo = require('./contenedores/filesContainer.js')
const contenidoMsjs = new ContenedorArchivo('./db/chat.txt')

const routerProductos = Router()
const routerCarrito = Router()
const routerProductosTest = Router()
const routerChat = Router()

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded( {extended: true} ))
app.use('/api/productos-test', routerProductosTest)
app.use('/api/productos', routerProductos)
app.use('/api/carrito', routerCarrito)
app.use('/api/chat', routerChat)

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

// Rutas Chat

const authorNormalizerSchema = new schema.Entity('author',{},{ idAttribute: 'mail' })
const textNormalizerSchema = new schema.Entity('text',{author: authorNormalizerSchema}, {idAttribute: 'id'} )
const messagesNormalizerSchema = [textNormalizerSchema]

routerChat.get('/', async (req, res) => {
  let msjs= await contenidoMsjs.getAll()
  console.log(msjs)
  res.json(normalize(msjs, messagesNormalizerSchema, {idAttribute: 'email'}))
})

routerChat.post('/', async (req, res) => {
  console.log('hola?')
  contenidoMsjs.save(req.body).then(resp => res.json(resp))
})

// Chat con Websockets

io.on('connection', async socket => {

  console.log('Nuevo cliente conectado')
  
  socket.on('nuevoMensaje', () => {
    console.log('evento')
    io.sockets.emit('updateMsj')
  })
})

const srv = server.listen(PORT, () => { 
  console.log(`Servidor Http escuchando en el puerto ${srv.address().port}`);
})
srv.on('error', error => console.log(`Error en servidor ${error}`))