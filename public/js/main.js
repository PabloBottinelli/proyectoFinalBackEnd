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

  socket.emit('message', mensaje)

  mandarMensaje.reset()
})

socket.on('messages', msgs => {
  let msgTime = new Date().toLocaleString()
  let htmlContent = msgs.map( msg => `<p><b style="color:rgb(219, 33, 108); font-size: 20px;">${msg.username}</b> <span style="color:rgb(33, 139, 219); font-size: 20px;">[${msgTime}]</span>: <i style="color:black; font-size: 20px;">${msg.content}</i></p>`).join('')
  document.getElementById('mensajes').innerHTML = htmlContent
})