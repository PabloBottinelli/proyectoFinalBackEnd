const express = require('express')
const { Router } = require('express')
const routerWeb = new Router()
routerWeb.use(express.json())
routerWeb.use(express.urlencoded({ extended: true }))
const passport = require('../middleware/auth')
const checkAuth = require('../middleware/middleware')

/* ------------------ Rutas Web -------------------- */

routerWeb.get('/', checkAuth, (req, res) => {
  res.sendFile('index.html', { root: './public/home' })}
)

routerWeb.get('/api/user', (req, res) => {
  res.json(req.user.username)
})

/* ------------------ Rutas Login -------------------- */
  
routerWeb.get('/login', (req, res) => {
  res.sendFile('login.html', { root: './public/login' })
})

routerWeb.post('/login', 
  passport.authenticate('login', { failureRedirect: '/login-error', successRedirect: '/' })
)

routerWeb.get('/login-error', (req, res) => {
  res.sendFile('login-error.html', { root: './public/login' })
})

/* ------------------ Rutas Register -------------------- */

routerWeb.get('/register', (req, res) => {
  res.sendFile('register.html', { root: './public/login' })
})

routerWeb.post('/register', passport.authenticate('signup', { successRedirect: '/login', failureRedirect: '/register-error' }))

routerWeb.get('/register-error', (req, res) => {
  res.sendFile('register-error.html', { root: './public/login' })
})

/* ------------------ Rutas Logout -------------------- */

routerWeb.get('/logout-despedida', (req, res) => {
  res.sendFile('logout.html', { root: './public/login' })
})

routerWeb.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})



module.exports={ routerWeb }
