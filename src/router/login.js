const express = require('express')
const { Router } = require('express')
const routerLogin = Router()
routerLogin.use(express.json())
routerLogin.use(express.urlencoded({ extended: true }))

/* ------------------ Rutas Login -------------------- */

routerLogin.get('/user', (req, res)=>{
  res.json({nombre: req.session.nombre})
})

routerLogin.get('/', (req, res)=>{
  res.sendFile('login.html', { root: './public/login' })
})
  
routerLogin.post('/', (req, res)=>{
  const { nombre } = req.body
  req.session.nombre = nombre
  res.redirect("/")
})

module.exports={ routerLogin }
