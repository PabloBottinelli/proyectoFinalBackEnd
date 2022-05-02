let socket = io.connect()

const mandarMensaje = document.getElementById("chat")
mandarMensaje.addEventListener("submit", e => {
  e.preventDefault()

  const mensaje = {
    content: document.getElementById("contenido").value,
    username: document.getElementById("mail").value
  }

  socket.emit('message', mensaje)

  mandarMensaje.reset()
})

socket.on('messages', msgs => {
  let msgTime = new Date().toLocaleString()
  let htmlContent = msgs.map( msg => `<p><b style="color:rgb(219, 33, 108); font-size: 20px;">${msg.username}</b> <span style="color:rgb(33, 139, 219); font-size: 20px;">[${msgTime}]</span>: <i style="color:black; font-size: 20px;">${msg.content}</i></p>`).join('')
  document.getElementById('mensajes').innerHTML = htmlContent
})