const express = require('express')
const { Router } = require('express')
const routerLogin = Router()
routerLogin.use(express.json())
routerLogin.use(express.urlencoded({ extended: true }))

/* ------------------ Rutas Login -------------------- */

const usuarios = [{nombre: 'pablo'}]

routerLogin.get('/user', (req, res)=>{
    const usuario = usuarios.find(usuario => usuario.nombre == req.session.nombre)
    if(!usuario){
      res.json("No se encontro usuario logueado")
    }
    res.json({nombre: usuario.nombre})
})

routerLogin.get('/', (req, res)=>{
    res.sendFile('login.html', { root: './public/login' })
})
  
routerLogin.post('/', (req, res)=>{
    const { nombre } = req.body
    const usuario = usuarios.find(usuario => usuario.nombre == nombre)
    if(!usuario){
      return res.redirect('login-error')
    }
    req.session.nombre = nombre
    res.redirect("/")
})

module.exports={ routerLogin }
