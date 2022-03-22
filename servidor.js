const express = require('express')
const fs = require('fs')
const app = express()
const PORT = 8080
const Contenedor = require('./contenedor.js')
const contenido = new Contenedor('./productos.txt')

async function getRandom(){
    try{
        const productos = await contenido.getAll()
        const max = productos.length
        const number = Math.floor(Math.random() * (max - 1)) + 1
        const producto = await contenido.getById(number)
        return producto
    }
    catch(err){
        console.log(err)
    }
}

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

app.get('/', (req, res) => {
    res.send('<h1> Bienvenidos <h1>')
})

app.get('/productos', (req, res) => {
    contenido.getAll().then(resp => res.send(`<p> ${JSON.stringify(resp)} <p>`))
})

app.get('/productoRandom', (req, res) => {
    getRandom().then(resp => res.send(`<p> ${JSON.stringify(resp)} <p>`))
})


// app.get('/productoRandom', (req, res) => {
//     async function getRandom(){
//         try{           
//             const contenido = await fs.promises.readFile(`./productos.txt`, 'utf-8')
//             const products = JSON.parse(contenido);
//             console.log(products)
//             const max = products.length
//             const number = Math.floor(Math.random() * (max - 1)) + 1;
//             const producto = products.find(e => e.id == number)
//             res.send(`<h1> ${JSON.stringify(producto)} <h1>`)

//         }
//         catch(err){ 
//             console.log(err)
//             res.send(`<h1> No se encontro <h1>`)
//         }
//     }
//     getRandom()
// })

