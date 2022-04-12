// export default class Contenedor{}
class Contenedor{
    constructor(){
        this.producto = []
    }
    
    async getAll(){
        try{ 
            return this.producto
        }catch(err){
            console.log(err)
        }
    }
  
    async getById(id){
        try{
            const producto = this.producto.find(e => e.id == id)
            if(producto == undefined){
                const error =  {'error': 'producto no encontrado'}
                return error
            }else{
                return producto
            }
        }catch(err){
            console.log(err)
        }
    }

    async save(title, price, thumbnail) {
        const producto = {
            title: title,
            price: price,
            thumbnail: thumbnail,
            id: null
        }
        try{          
            const i = this.producto.length - 1 // no agarro directamente el length del array y le sumo 1 para el id del nuevo producto, porque si hago eso hay un error, al eliminar un elemento con deleteById y agregar uno nuevo, va a repetir el id del ultimo elemento del array. Asi que mejor agarro el id del ultimo elemento del array y le sumo 1
            producto.id = this.producto[i].id +  1
            this.producto.push(producto)
            return this.producto
        }
        catch(err){
            producto.id = 1
            this.producto.push(producto)
            return this.producto
        }
    }

    async deleteById(id){
        try{
            const producto = this.producto.find(e => e.id == id)
            if(producto == undefined){
                const error =  {'error': 'producto no encontrado'}
                return error
            }else{
                const indexDelProducto = this.producto.indexOf(producto)
                this.producto.splice(indexDelProducto, 1)
                return this.producto
            }
        }catch(err){
            console.log(err)
        }
    }

    async changeById(id, nombre, precio, url){
        try{
            const producto = this.producto.find(e => e.id == id)
            if(producto == undefined){
                const error =  {'error': 'producto no encontrado'}
                return error
            }else{
                const indexDelProducto = this.producto.indexOf(producto)
                if(nombre){ producto[indexDelProducto] = nombre }
                if(precio){ producto[indexDelProducto] = precio }
                if(url){ producto[indexDelProducto] = url }    
                console.log(this.producto)
                return this.producto
            }
        }catch(err){
            console.log(err)
        }
    }
}
module.exports = Contenedor