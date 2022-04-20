const fs = require('fs')
const express = require('express')
const app = express()
const { Router } = express
const adm = require('./middleware/middleware.js')

const contenedorProductos = require('./contenedorProductos.js')
const prods = [{"title": "Camara","price": 5000,"thumbnail": "https://cdn3.iconfinder.com/data/icons/education-and-school-8/48/Camera-128.png","id": 1,"timestamp": "19/04/2022, 10:30:59 PM","description": "Camara profesional","code": 100211,"stock": 100},{"title": "PC","price": 6500,"thumbnail": "https://cdn3.iconfinder.com/data/icons/education-and-school-8/48/Computer-128.png","id": 2,"timestamp": "19/04/2022, 10:04:57 PM","description": "PC Gamer","code": 1002143,"stock": 100},{"title": "Lampara","price": 1000,"thumbnail": "https://cdn3.iconfinder.com/data/icons/education-and-school-8/48/Light-128.png","id": 3,"timestamp": "19/04/2022, 10:04:57 PM","description": "Lampara de estudio","code": 10143404,"stock": 100}]
var contenidoProductos = new contenedorProductos(prods)

const contenedorCarritos = require('./contenedorCarritos.js')
const carritos = [{"id": 1,"timestamp": "19/04/2022, 10:05:58 PM","products": []}]
var contenidoCarritos = new contenedorCarritos(carritos)

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

let carts = []

routerCarrito.get('/', async (req, res) => {
  contenidoCarritos.getAll().then(resp => res.send(resp))
})

routerCarrito.get('/:id/productos', async (req, res) => {
  contenidoCarritos.getProducts(req.params.id).then(resp => res.send(resp))
})

routerCarrito.post('/', async (req, res) => {
  contenidoCarritos.save().then(resp => res.send(resp))
})

routerCarrito.post('/:id/productos', async (req, res) => {
  contenidoProductos.getById(req.body.id_prod).then(resp => resp.error ? res.json(resp) : contenidoCarritos.addProduct(req.params.id, resp).then(resp => res.json(resp)))
})

routerCarrito.delete('/:id', async (req, res) => {
  contenidoCarritos.deleteById(req.params.id).then(resp => res.json(resp))
})

routerCarrito.delete('/:id/productos/:id_prod', async (req, res) => {
  contenidoCarritos.deleteProduct(req.params.id, req.params.id_prod).then(resp => res.json(resp))
})

app.get('*', function (req, res) {
  res.json({ error : -2, descripcion: `ruta ${req.path} - método ${req.method} no implementados`})
})

const PORT = process.env.PORT || 8080;

const srv = app.listen(PORT, () => { 
    console.log(`Servidor Http escuchando en el puerto ${srv.address().port}`);
})
srv.on('error', error => console.log(`Error en servidor ${error}`))