const socket = io.connect();

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

// Chat con Normalizer
//Denormalize
const authorNormalizerSchema = new normalizr.schema.Entity('author',{},{ idAttribute: 'mail' })
const textNormalizerSchema = new normalizr.schema.Entity('text',{author: authorNormalizerSchema}, {idAttribute: 'id'} )
const messagesNormalizerSchema = [textNormalizerSchema]

listarMensajes()

socket.on('updateMsj', () => {
  console.log("evento updateMsj llego al cliente")
  listarMensajes() 
})

const enviar = document.getElementById('enviar')

enviar.addEventListener('click', () => {
  console.log('q pasa')
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
  fetch('/api/chat', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(data)
  })
  .then(socket.emit('nuevoMensaje', 'Nuevo mensaje enviado'))
  .catch(err => console.error(err))
})

async function listarMensajes() {
  const plantillaMsj = await buscarPlantillaMensaje()
  const mensajesNormalizado = await buscarMensajes()
  console.log(JSON.stringify(mensajesNormalizado))
  const mensajes = normalizr.denormalize(mensajesNormalizado.result, messagesNormalizerSchema, mensajesNormalizado.entities)
  console.log(JSON.stringify(mensajes))
  let rate = JSON.stringify(mensajesNormalizado).length/JSON.stringify(mensajes).length;
  const htmlMsj = armarHTMLmsj(plantillaMsj, mensajes, rate.toFixed(2)*100)
  document.getElementById('mensajes').innerHTML = htmlMsj
}

function buscarMensajes() {
  return fetch('/api/chat')
  .then(msjs => msjs.json())
}

function buscarPlantillaMensaje() {
  return fetch('/plantillas/chat.hbs')
  .then(resp => resp.text())
}

function armarHTMLmsj(plantillaMsj, mensajes, rate) {
  const render = Handlebars.compile(plantillaMsj);
  const html = render({ mensajes, rate })
  return html
}
