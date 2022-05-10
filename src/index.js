const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { Router } = express
const adm = require('./middleware/middleware.js')
const { engine } = require ('express-handlebars')
const { ENV: { PORT } } = require('../config');

app.engine('handlebars', engine())
app.set('view engine', 'hbs')
app.set("views", "./views")

const { ProductsDao } = require('./daos/index')
const contenidoProductos = new ProductsDao()

const { CartsDao } = require('./daos/index')
const contenidoCarritos = new CartsDao()

const contenedorMsgs = require('./contenedores/contenedorChat.js')
var contenidoMsgs = new contenedorMsgs('chat')

const routerProductos = Router()
const routerCarrito = Router()

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded( {extended: true} ))
app.use('/api/productos', routerProductos)
app.use('/api/carrito', routerCarrito)

// Rutas Productos

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

app.get('*', function (req, res) {
  res.json({ error : -2, descripcion: `ruta ${req.path} - método ${req.method} no implementados`})
})

// Chat con Websockets

io.on('connection', async socket => {

  console.log('Nuevo cliente conectado')

  socket.emit('messages', await contenidoMsgs.getAll())

  socket.on('message' , async msg => {
    msg.fyh = new Date().toLocaleString()
    await contenidoMsgs.save(msg)
    io.sockets.emit('messages', await contenidoMsgs.getAll())
  })
})

const srv = server.listen(PORT, () => { 
    console.log(`Servidor Http escuchando en el puerto ${srv.address().port}`);
})
srv.on('error', error => console.log(`Error en servidor ${error}`))