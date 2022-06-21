const express = require('express')
const session = require("express-session")
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { engine } = require ('express-handlebars')
const { normalize, schema, denormalize } = require('normalizr')
require('dotenv').config()
const passport = require('passport')
const parseArgs = require('minimist')
const config = require('../config')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const { logger } = require("../logger")

app.engine('handlebars', engine())
app.set('view engine', 'hbs')
app.set("views", "./views")

/* ------------------ Persistencia Mongo -------------------- */

const MongoStore = require("connect-mongo")
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.credenciales.MONGOATLAS,
      mongoOptions: advancedOptions
    }),
    secret: config.credenciales.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,  
    rolling: true,
    cookie: {
      maxAge: 60000
    }
  })
)

app.use(passport.initialize())
app.use(passport.session())

/* ------------------ Contenedores y Rutas -------------------- */

const ContenedorArchivo = require('./contenedores/filesContainer.js')
const contenidoMsjs = new ContenedorArchivo('./db/chat.txt')

const { routerProductosTest } = require("./router/productos")
const { routerProductos } = require("./router/productos")
const { routerCarrito } = require("./router/carrito")
const { routerWeb } = require("./router/web")
const { routerInfo } = require("./router/info")
const { routerRandom } = require("./router/random")

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded( {extended: true} ))
app.use('/api/productos-test', routerProductosTest)
app.use('/api/productos', routerProductos)
app.use('/api/carrito', routerCarrito)
app.use('/api/info', routerInfo)
app.use('/randoms', routerRandom)
app.use('/', routerWeb)

/* ------------------ Para rutas inexistentes -------------------- */

app.get('*', async (req, res)=>{
  logger.warn(`[${req.method}] => ${req.path}`)
  res.json({ error : -2, descripcion: `ruta ${req.path} - método ${req.method} no implementados`})
})

/* ------------------ Chat con Socket y Normalizr -------------------- */

const authorNormalizerSchema = new schema.Entity('author',{},{ idAttribute: 'mail' })
const textNormalizerSchema = new schema.Entity('text',{author: authorNormalizerSchema}, {idAttribute: 'id'} )
const messagesNormalizerSchema = [textNormalizerSchema]

async function normalizarMsgs(){
  const msgs = await contenidoMsjs.getAll()
  const normalizado = normalize(msgs, messagesNormalizerSchema, {idAttribute: 'email'})
  return JSON.stringify(normalizado)
} 

async function denormalizar(msgs){
  const mensajesNormalizados = JSON.parse(msgs)
  const mensajes = denormalize(mensajesNormalizados.result,messagesNormalizerSchema, mensajesNormalizados.entities)
  return mensajes
}

io.on('connection', async socket => {
  logger.info('Nuevo cliente conectado')

  const mensajes = await normalizarMsgs()
  const longNorm = mensajes.length
  const denorm = await denormalizar(mensajes)
  const longSinNorm = JSON.stringify(denorm).length
  const porcentajeC = (longNorm * 100) / longSinNorm
  let rate = porcentajeC.toFixed(2)

  let porcentaje = {
    rate
  }
 
  denorm.push(porcentaje)
  socket.emit('messages', denorm)

  socket.on('message' , msg => {
    contenidoMsjs.save(msg).then(contenidoMsjs.getAll().then(resp => io.sockets.emit('messages', resp)))
  })
})

/* ------------------ Server -------------------- */

const options = {
  alias:{
    p: 'puerto',
    m: 'modo'
  },
  default:{
    puerto: 8080,
    modo: 'FORK'
  }
}

const commandLineArgs = process.argv.slice(2)
const { puerto, modo, _ } = parseArgs(commandLineArgs, options)
logger.info({ puerto, modo, otros: _ })

if(modo=='CLUSTER' && cluster.isMaster){  
  logger.info(`Número de procesadores: ${numCPUs}`)
  logger.info(`PID Master ${process.pid}`)

  for(let i=0; i < numCPUs; i++){
    cluster.fork()
  }

  cluster.on('exit', worker =>{
    logger.info('Worker', worker.process.pid, 'died', new Date().toLocaleString())
    cluster.fork()
  })

}else{
  const srv = server.listen(puerto, () => { 
    logger.info(`Servidor HTTP escuchando en el puerto ${srv.address().port} - PID WORKER ${process.pid}`);
  })
  srv.on('error', error => logger.error(`Error en servidor ${error}`))
}