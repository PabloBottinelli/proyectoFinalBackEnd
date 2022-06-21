const express = require('express')
const { Router } = require('express')
const routerProductos = Router()
routerProductos.use(express.json())
routerProductos.use(express.urlencoded({ extended: true }))
const { logger } = require("../../logger")
const { faker } = require('@faker-js/faker')

const routerProductosTest = Router()
routerProductosTest.use(express.json())
routerProductosTest.use(express.urlencoded({ extended: true }))

const { ProductsDao } = require('../daos/index')
const contenidoProductos = new ProductsDao()
const adm = require('../middleware/middleware')

/* ------------------ Rutas Productos -------------------- */

let id = 1
function getId(){
  return id++
}

routerProductosTest.get('/', async (req, res)=>{
  logger.info(`[${req.method}] => ${req.path}`)
  let productos = []
    
  for (let index = 0; index < 5; index++){
    productos.push({
      id: getId(),
      title: faker.commerce.productName(),
      price: faker.commerce.price(),
      thumbnail: faker.image.image()
    })
}
  res.json(productos)
})

routerProductos.get('/:id?', async (req, res)=>{
  logger.info(`[${req.method}] => ${req.path}`)
  if(req.params.id){
    contenidoProductos.getById(req.params.id).then(resp => res.send(resp))
  }else{
    contenidoProductos.getAll().then(resp => res.send(resp))
  }
})

routerProductos.post('/', adm, async (req, res)=>{
  logger.info(`[${req.method}] => ${req.path}`)
  contenidoProductos.save(req.body).then(resp => res.json(resp))
})

routerProductos.delete('/:id', adm, async (req, res)=>{
  logger.info(`[${req.method}] => ${req.path}`)
  contenidoProductos.deleteById(req.params.id).then(resp => res.json(resp))
})

routerProductos.put('/:id', adm, async (req, res)=>{
  logger.info(`[${req.method}] => ${req.path}`)
  contenidoProductos.changeById(req.params.id, req.body).then(resp => res.json(resp))
})

module.exports={routerProductos, routerProductosTest}
