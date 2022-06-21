const express = require('express')
const { Router } = require('express')
const routerCarrito = Router()
routerCarrito.use(express.json())
routerCarrito.use(express.urlencoded({ extended: true }))
const { logger } = require("../../logger")

const { CartsDao } = require('../daos/index')
const contenidoCarritos = new CartsDao()

/* ------------------ Rutas Carrito -------------------- */

routerCarrito.get('/', async (req, res)=>{
    logger.info(`[${req.method}] => ${req.path}`)
    contenidoCarritos.getAll().then(resp => res.send(resp))
})
  
routerCarrito.get('/:id/productos', async (req, res)=>{
    logger.info(`[${req.method}] => ${req.path}`)
    contenidoCarritos.getProducts(req.params.id).then(resp => res.send(resp))
})
  
routerCarrito.post('/', async (req, res)=>{
    logger.info(`[${req.method}] => ${req.path}`)
    contenidoCarritos.save(req.body).then(resp => res.send(resp))
})
  
routerCarrito.post('/:id/productos', async (req, res)=>{
    logger.info(`[${req.method}] => ${req.path}`)
    contenidoProductos.getById(req.body.id_prod).then(resp => resp.error ? res.json(resp) : contenidoCarritos.addProduct(req.params.id, resp).then(resp => res.json(resp)))
})
  
routerCarrito.delete('/:id', async (req, res)=>{
    logger.info(`[${req.method}] => ${req.path}`)
    contenidoCarritos.deleteById(req.params.id).then(resp => res.json(resp))
})
  
routerCarrito.delete('/:id/productos/:id_prod', async (req, res)=>{
    logger.info(`[${req.method}] => ${req.path}`)
    contenidoProductos.getById(req.params.id_prod).then(resp => resp.error ? res.json(resp) : contenidoCarritos.deleteProduct(req.params.id, resp).then(resp => res.json(resp)))
})
  
module.exports={ routerCarrito }

  