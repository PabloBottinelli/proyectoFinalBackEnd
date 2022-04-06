import express from 'express'
import { Router } from 'express'
import { engine } from 'express-handlebars';
import Contenedor from './contenedorProductos.js'
const contenido = new Contenedor()

const app = express()
const router = Router()

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded( {extended: true} ))
app.use('/api', router)

// handlebars
app.engine('handlebars', engine())
app.set("view engine", "handlebars")
app.set("views", './views')

// pug
// app.set("view engine", "pug")
// app.set("views", './views')

// ejs
// app.set("view engine", "ejs")
// app.set("views", './views')

// const productos = [{"title":"Agenda","price":234.56,"thumbnail":"google.com","id":1},{"title":"Bicicleta","price":500,"thumbnail":"google.com","id":2},{"title":"Heladera","price":1500,"thumbnail":"google.com","id":3}]
// links para post de productos camara: https://cdn3.iconfinder.com/data/icons/education-and-school-8/48/Camera-128.png
// pc: https://cdn3.iconfinder.com/data/icons/education-and-school-8/48/Computer-128.png
// cuaderno: https://cdn3.iconfinder.com/data/icons/education-and-school-8/48/Book-128.png

router.get('/', (req, res) =>{
    res.render("form")
})

//handlebars
router.get('/productos', (req, res) =>{
    contenido.getAll().then(resp => resp.length >= 1 ? res.render("productos", {resp}) : res.render("productos", { vacio: true }))
})

//pug y ejs
// router.get('/productos', (req, res) =>{
//     contenido.getAll().then(resp => res.render("productos", {resp}))
// })

router.post('/productos', (req, res) =>{
    contenido.save(req.body.nombre, req.body.precio, req.body.thumbnail).then(resp => res.render("completado"))
})

// router.get('/productos/:id', (req, res) =>{
//     contenido.getById(parseInt(req.params.id)).then(resp => res.send(`<p> ${JSON.stringify(resp)} <p>`))
// })


// router.put('/productos/:id', (req, res) =>{
//     contenido.changeById(parseInt(req.params.id), req.body.nombre, req.body.precio, req.body.thumbnail).then(resp => res.send(`<p> ${JSON.stringify(resp)} <p>`))
// })

// router.delete('/productos/:id', (req, res) =>{
//     contenido.deleteById(parseInt(req.params.id)).then(resp => res.send(`<p> ${JSON.stringify(resp)} <p>`))
// })

const server = app.listen(8080, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

