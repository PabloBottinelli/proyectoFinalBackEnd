const { Schema } = require('mongoose')
const mongoContainer = require('../../contenedores/mongoContainer')

const cartsSchema = new Schema({
  timestamp: { type: String, require: true },
  products: [{ type: Object }],
})

class CartsMongoDao extends mongoContainer {
  constructor() {
    super('carts', cartsSchema)
  }
}

module.exports = CartsMongoDao