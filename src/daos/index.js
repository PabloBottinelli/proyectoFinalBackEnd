// const { ENV: { PERS } } = require('../../config')
const config = require('../../config')

let ProductsDao
let CartsDao

switch(config.credenciales.ENV.PERS) {
  case 'firebase':
    ProductsDao = require('./productos/ProductsFirebaseDao')
    CartsDao = require('./carritos/CartsFirebaseDao')
    break
  case 'mongo':
    ProductsDao = require('./productos/ProductsMongoDao')
    CartsDao = require('./carritos/CartsMongoDao')
    break
  default:
    throw new Error('Método de persistencia invalido')
}

module.exports = {
  ProductsDao,
  CartsDao,
}