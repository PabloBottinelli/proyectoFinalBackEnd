const { Schema } = require('mongoose')
const mongoContainer = require('../../contenedores/mongoContainer')

const productsSchema = new Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  thumbnail: { type: String, require: true },
  price: { type: Number, require: true },
  stock: { type: Number, require: true },
  timestamp: { type: String, require: true }
})

class ProductsMongoDao extends mongoContainer {
  constructor() {
    super('productos', productsSchema)
  }
}

module.exports = ProductsMongoDao