const express = require('express')
const { Router } = require('express')
const routerWeb = new Router()
routerWeb.use(express.json())
routerWeb.use(express.urlencoded({ extended: true }))
const passport = require('../middleware/auth')
const { logger } = require("../../logger")
const checkAuth = require('../middleware/middleware')

/* ------------------ Rutas Web -------------------- */

routerWeb.get('/', checkAuth, (req, res) => {
  logger.info(`[${req.method}] => ${req.path}`)
  res.sendFile('index.html', { root: './public/home' })}
)

routerWeb.get('/api/user', (req, res) => {
  logger.info(`[${req.method}] => ${req.path}`)
  res.json(req.user.username)
})

/* ------------------ Rutas Login -------------------- */
  
routerWeb.get('/login', (req, res) => {
  logger.info(`[${req.method}] => ${req.path}`)
  res.sendFile('login.html', { root: './public/login' })
})

routerWeb.post('/login', 
  passport.authenticate('login', { failureRedirect: '/login-error', successRedirect: '/' })
)

routerWeb.get('/login-error', (req, res) => {
  logger.info(`[${req.method}] => ${req.path}`)
  res.sendFile('login-error.html', { root: './public/login' })
})

/* ------------------ Rutas Register -------------------- */

routerWeb.get('/register', (req, res) => {
  logger.info(`[${req.method}] => ${req.path}`)
  res.sendFile('register.html', { root: './public/login' })
})

routerWeb.post('/register', passport.authenticate('signup', { successRedirect: '/login', failureRedirect: '/register-error' }))

routerWeb.get('/register-error', (req, res) => {
  logger.info(`[${req.method}] => ${req.path}`)
  res.sendFile('register-error.html', { root: './public/login' })
})

/* ------------------ Rutas Logout -------------------- */

routerWeb.get('/logout-despedida', (req, res) => {
  logger.info(`[${req.method}] => ${req.path}`)
  res.sendFile('logout.html', { root: './public/login' })
})

routerWeb.get('/logout', (req, res) => {
  logger.info(`[${req.method}] => ${req.path}`)
  req.session.destroy()
  res.redirect('/login')
})

/* ------------------ Rutas Info -------------------- */

const compression = require('compression')

// routerWeb.get('/info', (req, res) => {
//   res.sendFile('info.html', { root: './public/info' })
// })

routerWeb.get('/info', compression(), (req, res) => {
  logger.info(`[${req.method}] => ${req.path}`)
  res.sendFile('info.html', { root: './public/info' })
})

module.exports={ routerWeb }
