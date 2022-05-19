let socket = io.connect()

const agregarProducto = document.getElementById("formulario-productos")
agregarProducto.addEventListener("submit", e => {
  e.preventDefault()

  const producto = {
    title: document.getElementById("title").value,
    price: document.getElementById("price").value,
    thumbnail: document.getElementById("thumbnail").value,
  }

  socket.emit('nuevo-producto', producto)

  agregarProducto.reset()
})

socket.on("products", async (products) => {
  let view = await fetch("../views/productos.hbs")
  let viewText = await view.text()
  let viewTextCompile = Handlebars.compile(viewText)

  let htmlContent = viewTextCompile({ products })

  document.getElementById("product-list").innerHTML = htmlContent
})

const mandarMensaje = document.getElementById("chat")
mandarMensaje.addEventListener("submit", e => {
  e.preventDefault()

  const mensaje = {
    username: document.getElementById("mail").value,
    content: document.getElementById("contenido").value
  }

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
  console.log(msgs)
  console.log('hola')
  let htmlContent = msgs.map( msg => `<p><b style="color:rgb(219, 33, 108); font-size: 20px;">${msg.author.mail}</b> <span style="color:rgb(219, 33, 108); font-size: 18px;">${msg.fyh}</span>: <i style="color:black; font-size: 20px;">${msg.mensaje}</i></p>`).join('')
  document.getElementById('mensajes').innerHTML = htmlContent
})