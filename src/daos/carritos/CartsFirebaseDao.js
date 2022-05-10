const firebaseContainer = require('../../contenedores/firebaseContainer')

class CartsFirebaseDao extends firebaseContainer {
  constructor() {
    super('carts')
  }
}

module.exports = CartsFirebaseDao