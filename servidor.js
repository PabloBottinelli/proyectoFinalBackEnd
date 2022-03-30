import express from 'express'
import { Router } from 'express'
import Contenedor from './contenedorProductos.js'
const contenido = new Contenedor([])

const app = express()
const router = Router()

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded( {extended: true} ))
app.use('/api', router)

// const productos = [{"title":"Agenda","price":234.56,"thumbnail":"google.com","id":1},{"title":"Bicicleta","price":500,"thumbnail":"google.com","id":2},{"title":"Heladera","price":1500,"thumbnail":"google.com","id":3}]

router.get('/productos', (req, res) =>{
    contenido.getAll().then(resp => res.send(`<p> ${JSON.stringify(resp)} <p>`))
})

router.get('/productos/:id', (req, res) =>{
    contenido.getById(parseInt(req.params.id)).then(resp => res.send(`<p> ${JSON.stringify(resp)} <p>`))
})

router.post('/productos', (req, res) =>{
    contenido.save(req.body.nombre, req.body.precio, req.body.thumbnail).then(resp => res.send(`<p> ${JSON.stringify(resp)} <p>`))
})

router.put('/productos/:id', (req, res) =>{
    contenido.changeById(parseInt(req.params.id), req.body.nombre, req.body.precio, req.body.thumbnail).then(resp => res.send(`<p> ${JSON.stringify(resp)} <p>`))
})

router.delete('/productos/:id', (req, res) =>{
    contenido.deleteById(parseInt(req.params.id)).then(resp => res.send(`<p> ${JSON.stringify(resp)} <p>`))
})

const server = app.listen(8080, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))