const express = require('express')
const { Router } = require('express')
const routerCarrito = Router()
routerCarrito.use(express.json())
routerCarrito.use(express.urlencoded({ extended: true }))

const { CartsDao } = require('../daos/index')
const contenidoCarritos = new CartsDao()

/* ------------------ Rutas Carrito -------------------- */

routerCarrito.get('/', async (req, res)=>{
    contenidoCarritos.getAll().then(resp => res.send(resp))
})
  
routerCarrito.get('/:id/productos', async (req, res)=>{
    contenidoCarritos.getProducts(req.params.id).then(resp => res.send(resp))
})
  
routerCarrito.post('/', async (req, res)=>{
    contenidoCarritos.save(req.body).then(resp => res.send(resp))
})
  
routerCarrito.post('/:id/productos', async (req, res)=>{
    contenidoProductos.getById(req.body.id_prod).then(resp => resp.error ? res.json(resp) : contenidoCarritos.addProduct(req.params.id, resp).then(resp => res.json(resp)))
})
  
routerCarrito.delete('/:id', async (req, res)=>{
    contenidoCarritos.deleteById(req.params.id).then(resp => res.json(resp))
})
  
routerCarrito.delete('/:id/productos/:id_prod', async (req, res)=>{
    contenidoProductos.getById(req.params.id_prod).then(resp => resp.error ? res.json(resp) : contenidoCarritos.deleteProduct(req.params.id, resp).then(resp => res.json(resp)))
})
  
module.exports={ routerCarrito }

  