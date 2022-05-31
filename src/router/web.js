const express = require('express')
const { Router } = require('express')
const routerWeb = new Router()
routerWeb.use(express.json())
routerWeb.use(express.urlencoded({ extended: true }))
const { usuarioModel } = require('../models/user')
const passport = require('passport')
const checkAuth = require('../middleware/middleware')

/* ------------------ Rutas Web -------------------- */

routerWeb.get('/', checkAuth, (req, res) => {
  res.sendFile('index.html', { root: './public/home' })}
)

routerWeb.get('/api/user', (req, res) => {
  res.json(req.user.username)
})
  
routerWeb.get('/login', (req, res) => {
  res.sendFile('login.html', { root: './public/login' })
})

routerWeb.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login-error', successRedirect: '/' })
)

routerWeb.get('/register', (req, res) => {
    res.sendFile('register.html', { root: './public/login' })
})

routerWeb.post('/register', (req, res) => {
  const { username, password } = req.body
  usuarioModel.register({ username: username, active: false }, password, function (err, user) {
    if (err) {
      res.redirect('/register-error')
    } else {
      res.redirect('/login')
    }
  })
})

routerWeb.get('/register-error', (req, res) => {
  res.sendFile('register-error.html', { root: './public/login' })
})

routerWeb.get('/logout-despedida', (req, res) => {
  res.sendFile('logout.html', { root: './public/login' })
})

routerWeb.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})

routerWeb.get('/login-error', (req, res) => {
  res.sendFile('login-error.html', { root: './public/login' })
})

module.exports={ routerWeb }
