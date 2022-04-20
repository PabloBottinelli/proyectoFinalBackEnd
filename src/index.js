const fs = require('fs')
const express = require('express')
const app = express()
const Contenedor = require('./contenedorProductos.js')
var contenido = new Contenedor()
const { Router } = express
const adm = require('./middleware/middleware.js')

const routerProductos = Router()
const routerCarrito = Router()

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded( {extended: true} ))
app.use('/api/productos', routerProductos)
app.use('/api/carrito', routerCarrito)

// Rutas Productos

let productos = []

routerProductos.get('/:id?', async (req, res) => {
  if(req.params.id){
    productos = await fs.promises.readFile('./src/productos.txt')
    const productosJSON = JSON.parse(productos)
    let { id } = req.params
    let producto = productosJSON.find( x => x.id === parseInt(id))
    res.json(producto ? { producto: producto } : { error : 'No se encontró el producto' })
  }else{
    productos = await fs.promises.readFile('./src/productos.txt')
    res.send(JSON.parse(productos))
  }
})

routerProductos.post('/', adm, async (req, res) => {
  try{
    productos = await fs.promises.readFile('./src/productos.txt')
  }catch(err){
    throw new Error(`Error: ${err.message}`)
  }

  const productosJSON = JSON.parse(productos)

  let { title, price, thumbnail, description, code, stock } = req.body

  const crearId = () => {
    const i = productosJSON.length - 1 // no agarro directamente el length del array y le sumo 1 para el id del nuevo producto, porque si hago eso hay un error, al eliminar un elemento con deleteById y agregar uno nuevo, va a repetir el id del ultimo elemento del array. Asi que mejor agarro el id del ultimo elemento del array y le sumo 1
    const id = productosJSON[i].id +  1
    return id
  }

  const producto = {
    title: title,
    price: price,
    thumbnail: thumbnail,
    id: crearId(),
    timestamp: new Date().toLocaleString(),
    description: description,
    code: code,
    stock: stock
  }
  productosJSON.push(producto)

  try {
    await fs.promises.writeFile('./src/productos.txt', JSON.stringify(productosJSON, null, 2))
  }catch(err){
    throw new Error(`Error: ${err.message}`)
  }
  
  res.json({ agregado: producto })
})

routerProductos.delete('/:id', adm, async (req, res) => {
  try{
    productos = await fs.promises.readFile('./src/productos.txt')
  }catch(err){
    throw new Error(`Error: ${err.message}`)
  }
  const productosJSON = JSON.parse(productos)
  let { id } = req.params
  let producto = productosJSON.find(x => x.id === parseInt(id))

  if(producto){
    const indexDelProducto = productosJSON.indexOf(producto)
    const eliminar = productosJSON[indexDelProducto]
    productosJSON.splice(indexDelProducto, 1)
    try {
      await fs.promises.writeFile('./src/productos.txt', JSON.stringify(productosJSON, null, 2))
    }catch(err){
      throw new Error(`Error: ${err.message}`)
    }
    res.json({ eliminado: eliminar })
  }else{
    res.json({ error: 'No se encontró'})
  }
})

routerProductos.put('/:id', adm, async (req, res) => {
  try{
    productos = await fs.promises.readFile('./src/productos.txt')
  }catch(err){
    throw new Error(`Error: ${err.message}`)
  }
  const productosJSON = JSON.parse(productos)

  let { id } = req.params
  let producto = productosJSON.find( x => x.id === parseInt(id))
  if(producto){
    const indexDelProducto = productosJSON.indexOf(producto)
    productosJSON[indexDelProducto].title = req.body.title
    productosJSON[indexDelProducto].price = req.body.price
    productosJSON[indexDelProducto].thumbnail = req.body.thumbnail
    productosJSON[indexDelProducto].timestamp = new Date().toLocaleString()
    productosJSON[indexDelProducto].description = req.body.description
    productosJSON[indexDelProducto].code = req.body.code
    productosJSON[indexDelProducto].stock = req.body.stock

    try {
      await fs.promises.writeFile('./src/productos.txt', JSON.stringify(productosJSON, null, 2))
    }catch(err){
      throw new Error(`Error: ${err.message}`)
    }
    
    res.json({ seModifico: productosJSON[indexDelProducto] })
  }else{
    res.json({ error: 'No se encontró'})
  }
})

// Rutas Carritos

let carts = []

routerCarrito.get('/', async (req, res) => {
  carts = await fs.promises.readFile('./src/carritos.txt')
  res.send(JSON.parse(carts))
})

routerCarrito.get('/:id/productos', async (req, res) => {
  try{
    carts = await fs.promises.readFile('./src/carritos.txt')
  }catch(err){
    throw new Error(`Error: ${err.message}`)
  }
  const carritosJSON = JSON.parse(carts)
  let { id } = req.params
  let carrito = carritosJSON.find( x => x.id === parseInt(id))
  res.json(carrito ? { productosCarrito: carrito.products } : { error : 'No se encontró el carrito' })
})

routerCarrito.post('/', async (req, res) => {
  try{
    carts = await fs.promises.readFile('./src/carritos.txt')
  }catch(err){
    throw new Error(`Error: ${err.message}`)
  }
  const carritosJSON = JSON.parse(carts)
  const crearId = () => {
    const i = carritosJSON.length - 1 
    const id = carritosJSON[i].id +  1
    return id
  }
  const carrito = {
    id: crearId(),
    timestamp: new Date().toLocaleString(),
    products: []
  }
  
  carritosJSON.push(carrito)
  try {
    await fs.promises.writeFile('./src/carritos.txt', JSON.stringify(carritosJSON, null, 2))
  }catch(err){
    throw new Error(`Error: ${err.message}`)
  }
  res.json({ carritoCreado: carrito })
})

routerCarrito.post('/:id/productos', async (req, res) => {
  try{
    carts = await fs.promises.readFile('./src/carritos.txt')
    productos = await fs.promises.readFile('./src/productos.txt')
  }catch(err){
    throw new Error(`Error: ${err.message}`)
  }
  const carritosJSON = JSON.parse(carts)
  const productosJSON = JSON.parse(productos)
  let { id } = req.params
  let { id_prod } = req.body
  let carrito = carritosJSON.find( x => x.id === parseInt(id))
  let producto = productosJSON.find( x => x.id === parseInt(id_prod))

  if(carrito && producto){
    const indexDelCarrito = carritosJSON.indexOf(carrito)
    carritosJSON[indexDelCarrito].products.push(producto)

    try {
      await fs.promises.writeFile('./src/carritos.txt', JSON.stringify(carritosJSON, null, 2))
    }catch(err){
      throw new Error(`Error: ${err.message}`)
    }
    res.json({ agregado: carritosJSON[indexDelCarrito].products })
  }else{
    res.json({ error: 'No se encontro el carrito y/o el producto'})
  }
})

routerCarrito.delete('/:id', async (req, res) => {
  try{
    carts = await fs.promises.readFile('./src/carritos.txt')
  }catch(err){
    throw new Error(`Error: ${err.message}`)
  }
  const carritosJSON = JSON.parse(carts)
  let { id } = req.params
  let carrito = carritosJSON.find( x => x.id === parseInt(id))

  if(carrito){
    const indexDelCarrito = carritosJSON.indexOf(carrito)
    const eliminar = carritosJSON[indexDelCarrito]
    carritosJSON.splice(indexDelCarrito, 1)
    try {
      await fs.promises.writeFile('./src/carritos.txt', JSON.stringify(carritosJSON, null, 2))
    }catch(err){
      throw new Error(`Error: ${err.message}`)
    }
    res.json({ eliminado: eliminar })
  }else{
    res.json({ error: 'No se encontró'})
  }
})

routerCarrito.delete('/:id/productos/:id_prod', async (req, res) => {
  try{
    carts = await fs.promises.readFile('./src/carritos.txt')
  }catch(err){
    throw new Error(`Error: ${err.message}`)
  }
  const carritosJSON = JSON.parse(carts)
  let { id, id_prod } = req.params
  let carrito = carritosJSON.find( x => x.id === parseInt(id))

  if(carrito){
    const indexDelCarrito = carritosJSON.indexOf(carrito)
    const producto = carritosJSON[indexDelCarrito].products.find( x => x.id === parseInt(id_prod))
    
    if(producto){
      const indexDelProducto = carritosJSON[indexDelCarrito].products.findIndex( x => x.id === parseInt(id_prod))
      const eliminar = carritosJSON[indexDelCarrito].products[indexDelProducto]
      carritosJSON[indexDelCarrito].products.splice(indexDelProducto, 1)

      try {
        await fs.promises.writeFile('./src/carritos.txt', JSON.stringify(carritosJSON, null, 2))
      }catch(err){
        throw new Error(`Error: ${err.message}`)
      }
      res.json({ eliminado: eliminar })
    }else{
      res.json({ error: 'No se encontro el producto en el carrito' })
    }
  }else{
    res.json({ error: 'No se encontro el carrito' })
  }
})

app.get('*', function (req, res) {
  res.json({ error : -2, descripcion: `ruta ${req.path} - método ${req.method} no implementados`})
})

const PORT = process.env.PORT || 8080;

const srv = app.listen(PORT, () => { 
    console.log(`Servidor Http escuchando en el puerto ${srv.address().port}`);
})
srv.on('error', error => console.log(`Error en servidor ${error}`))