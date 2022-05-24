let socket = io.connect()

// const agregarProducto = document.getElementById("formulario-productos")
// agregarProducto.addEventListener("submit", e => {
//   e.preventDefault()

//   const producto = {
//     title: document.getElementById("title").value,
//     price: document.getElementById("price").value,
//     thumbnail: document.getElementById("thumbnail").value,
//   }

//   socket.emit('nuevo-producto', producto)

//   agregarProducto.reset()
// })

// socket.on("products", async (products) => {
//   let view = await fetch("../views/productos.hbs")
//   let viewText = await view.text()
//   let viewTextCompile = Handlebars.compile(viewText)

//   let htmlContent = viewTextCompile({ products })

//   document.getElementById("product-list").innerHTML = htmlContent
// })

// Productos con faker
const generarProductosFake = document.getElementById("generar")

generarProductosFake.addEventListener('click', e =>{
  e.preventDefault()
  listarProductosFake(true)
})

async function listarProductosFake(mostrar){
  const plantilla = await plantillaProductoFake()
  const productos_fake = await buscarProductosFake()
  const htmlfake = armarHTMLfake(plantilla, productos_fake, mostrar)
  document.getElementById('productos_fake').innerHTML = htmlfake
}

function buscarProductosFake(){
  return fetch('/api/productos-test')
  .then(prodfake => prodfake.json())
}

function plantillaProductoFake(){
  return fetch('/plantillas/productos_fake.hbs')
  .then(respuesta1 => respuesta1.text())
}

function armarHTMLfake(plantilla1, productos_fake,mostrar){
  const render = Handlebars.compile(plantilla1)
  const html = render({ productos_fake, mostrar })
  return html
}

// Chat con normalizr

const mandarMensaje = document.getElementById("chat")
mandarMensaje.addEventListener("submit", e => {
  // e.preventDefault()

  const mail = document.getElementById('mail')
  const nombre = document.getElementById('nombre')
  const apellido = document.getElementById('apellido')
  const edad = document.getElementById('edad')
  const alias = document.getElementById('alias')
  const avatar = document.getElementById('avatar')
  const msj = document.getElementById('mensaje')

  const data = {
    author:{ 
    mail: mail.value, 
    nombre: nombre.value, 
    apellido: apellido.value,
    edad: edad.value,
    alias: alias.value,
    avatar: avatar.value
    },
    mensaje: msj.value
  }

  socket.emit('message', data)

  mandarMensaje.reset()
})

socket.on('messages', msgs => {
  const rate = msgs.pop()
  let htmlContent = msgs.map( msg => `<p><b style="color:rgb(219, 33, 108); font-size: 20px;">${msg.author?.mail}</b> <span style="color:rgb(219, 33, 108); font-size: 18px;">${msg.fyh}</span>: <i style="color:black; font-size: 20px;">${msg.mensaje}</i></p>`).join('')
  let compresion = `<h2>Porcentaje de compresión: ${rate.rate} %</h2>`
  document.getElementById('porcentaje').innerHTML = compresion
  document.getElementById('mensajes').innerHTML = htmlContent
})

// Usuario
bannerUsuario()

async function bannerUsuario(){
  const plantillaUser = await buscarPlantillaUsuario()
  const user = await buscarUsuario()
  const htmluser = armarHTMLuser(plantillaUser,user)
  document.getElementById('usuario').innerHTML = htmluser
}

function buscarUsuario() {
  return fetch('/login/user')
  .then(msjs => msjs.json())
}

function buscarPlantillaUsuario() {
  return fetch('/plantillas/usuario.hbs')
  .then(respuesta3 => respuesta3.text())
}

function armarHTMLuser(plantillaUser,user) {
  const render = Handlebars.compile(plantillaUser,user);
  const html = render({ user })
  return html
}