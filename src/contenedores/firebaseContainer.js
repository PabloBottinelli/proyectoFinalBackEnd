const admin = require("firebase-admin")
const { getFirestore } = require("firebase-admin/firestore")
const config = require('../../config')
const { logger } = require("../../logger")

let count = 0
class firebaseContainer {
  constructor(collection) {
    this.connect()
    const db = getFirestore()
    this.query = db.collection(collection)
  }

  connect() {
    if(!count){ 
      admin.initializeApp({
        credential: admin.credential.cert(config.credenciales.DB_CONFIG.firebase.credential)
      })
      logger.info("Conexion con la base de datos establecida")
    }
    count++
  }

  async getAll(){ 
    try{
      const doc = await this.query.get()
      if(doc.docs.length == 0){
        return { completado: "No hay elementos cargados" }
      }else{
        const documents = doc.docs
        return documents.map(document => ({ 
          id: document.id,
          ...document.data()
        }))
      }
    }catch(err){
      console.log(err)
    }
  }

  async getById(id){
    try{
      const doc = this.query.doc(`${id}`)
      const document = await doc.get()
      if(document.data()){
        return document.data()
      }else{
        return { error: "No hay ningun elemento con ese id" }
      }
    }
    catch(err){
      console.log(err)
    }
  }

  async save(body){
    try{
      const doc = this.query.doc()
      body.timestamp = new Date().toLocaleString()
      await doc.create(body)
      return { completado: "Elemento insertado", elemento: body}
    }
    catch(err){
      console.log(err)
    }
  }

  async changeById(id, body){
    try{
      const doc = this.query.doc(`${id}`)      
      await doc.update(body)
      return { completado: "Elemento actualizado", elemento: body }     
    }
    catch{
      return { error: "Elemento no encontrado" }
    }
  }

  async deleteById(id){
    try{
      const doc = this.query.doc(`${id}`)
      await doc.delete()
      return { completado: "Elemento eliminado" }
    }
    catch{
      return { error: "Elemento no encontrado" }
    }
  }

  async getProducts(id){
    try{
      const cart = this.query.doc(`${id}`)
      const document = await cart.get()
      const cartData = document.data()
      return cartData.products
    }catch(err){
      console.log(err)
    }
  }

  async addProduct(id, product){
    try{
      const cart = this.query.doc(`${id}`)
      const document = await cart.get()
      const cartData = document.data()
      cartData.products.push(product)
      await cart.update(cartData)
      return { completado: "Productos agregados al carrito", carrito: cartData}
    }catch(err){
      console.log(err)
    }
  }

  async deleteProduct(id, prod){
    try{
      const cart = this.query.doc(`${id}`)
      const document = await cart.get()
      const cartData = document.data()
      if(prod){
        const indexDelProducto = cartData.products.indexOf(prod)
        cartData.products.splice(indexDelProducto, 1)
        await cart.update(cartData)
        return { completado: "Se elimino el producto" }
      }else{
        return { error: 'No se encontro el producto' }
      }
    }catch(err){
      console.log(err)
    }
  }
}

module.exports = firebaseContainer