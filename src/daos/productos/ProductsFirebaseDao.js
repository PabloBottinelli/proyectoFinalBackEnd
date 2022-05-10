const firebaseContainer = require('../../contenedores/firebaseContainer')

class ProductsFirebaseDao extends firebaseContainer {
  constructor() {
    super('productos')
  }
}

module.exports = ProductsFirebaseDao