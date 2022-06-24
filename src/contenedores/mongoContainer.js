const mongoose = require('mongoose')
const config = require('../../config')

let count = 0
class mongoContainer{
    constructor(collection, schema){
        if(!count) {
            mongoose.connect(config.credenciales.DB_CONFIG.mongodb.url, { useNewUrlParser: true }).then(() => console.log("Conexion con la base de datos establecida"))
        }
        count++
        this.model = mongoose.model(collection, schema)
    }

    async getAll(){
        try{
            const docs = await this.model.find({})
            if(docs.length === 0){
                return { completado: "No hay elementos cargados" }
            }else{
                return docs
            }
        }catch(err){
            console.log(err)
        }
    }

    async getById(id){
        try{
            const doc = await this.model.findOne({ _id: id })
            if(doc === null){
                return { error: "No se encontro el producto" }
            }else{
                return doc
            }
        }catch(err){
            console.log(err)
        }
    }

    async save(body){
        try{
            body.timestamp = new Date().toLocaleString()
            const doc = new this.model(body)
            await doc.save()
            return { completado: "Elemento insertado", elemento: body }
        }catch(err){
            console.log(err)
        }
    }

    async changeById(id, body){
        try{
            await this.model.updateOne({ id }, { $set: { ...body } })
            return { completado: "Elemento actualizado", elemento: body }  
        }catch(err){
            console.log(err)
        }
    }

    async deleteById(id){
        try{
            await this.model.deleteOne({ _id: id })
            return { completado: "Elemento eliminado" }
        }catch(err){
            console.log(err)
        }
    }

    async getProducts(id){
        try{
          const cartData = await this.model.findOne({ _id: id })
          return cartData.products
        }catch(err){
          console.log(err)
        }
      }

    async addProduct(id, product){
        try{
          const cartData = await this.model.findOne({ _id: id })
          cartData.products.push(product)
          await this.model.updateOne({ id }, { $set: { ...cartData } })
          return { completado: "Productos agregados al carrito", carrito: cartData}
        }catch(err){
          console.log(err)
        }
      }
    
      async deleteProduct(id, prod){
        try{
          const cartData = await this.model.findOne({ _id: id })
          if(prod){
            const index = cartData.products.indexOf(prod)
            cartData.products.splice(index, 1)
            await this.model.updateOne({ id }, { $set: { ...cartData } })
            return { completado: "Se elimino el producto" }
          }else{
            return { error: 'No se encontro el producto' }
          }
        }catch(err){
          console.log(err)
        }
      }
}

module.exports = mongoContainer