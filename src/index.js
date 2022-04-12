const fs = require('fs')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const Contenedor = require('C:/Users/Pablo/OneDrive/Escritorio/Escritorio/Coder House/Back End/proyecto/src/contenedorProductos.js')
var contenido = new Contenedor()
const { engine } = require ('express-handlebars')

app.engine('handlebars', engine())
app.set('view engine', 'hbs')
app.set("views", "./views")

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded( {extended: true} ))

// Productos
// 'Camara' '90000' 'https://cdn3.iconfinder.com/data/icons/education-and-school-8/48/Camera-128.png'
// 'PC' '50000' 'https://cdn3.iconfinder.com/data/icons/education-and-school-8/48/Computer-128.png'
// 'Lampara' '3000' 'https://cdn3.iconfinder.com/data/icons/education-and-school-8/48/Light-128.png'

const mensajes = []

io.on('connection', async socket => {

  console.log('Nuevo cliente conectado')
  contenido.getAll().then(resp => socket.emit('products', resp))

  socket.on('nuevo-producto', product => {
    contenido.save(product.title, product.price, product.thumbnail).then(contenido.getAll().then(resp => io.sockets.emit('products', resp)))
  })

  socket.emit('messages', mensajes)

  socket.on('message' , async msg => {
    mensajes.push({ username: msg.username, content: msg.content })
    io.sockets.emit('messages', mensajes)

    try{
      await fs.promises.writeFile('./chat.txt', JSON.stringify(mensajes))
    }catch(err){
      throw new Error(`Error en escritura: ${err.message}`)
    }
  })
})

const PORT = process.env.PORT || 8080;

const srv = server.listen(PORT, () => { 
    console.log(`Servidor Http con Websockets escuchando en el puerto ${srv.address().port}`);
})
srv.on('error', error => console.log(`Error en servidor ${error}`))