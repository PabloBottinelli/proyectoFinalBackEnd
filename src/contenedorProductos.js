class contenedorProductos{
    constructor(productos){
        this.productos = productos
    }
    
    async getAll(){
        try{ 
            return this.productos
        }catch(err){
            console.log(err)
        }
    }
  
    async getById(id){
        try{
            const producto = this.productos.find(e => e.id == id)
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

    async save(body){        
        try{   
            if(this.productos){
                const crearId = () => {
                    const i = this.productos.length - 1 // no agarro directamente el length del array y le sumo 1 para el id del nuevo producto, porque si hago eso hay un error, al eliminar un elemento con deleteById y agregar uno nuevo, va a repetir el id del ultimo elemento del array. Asi que mejor agarro el id del ultimo elemento del array y le sumo 1
                    const id = this.productos[i].id +  1
                    return id
                }
                const producto = {
                    title: body.title,
                    price: body.price,
                    thumbnail: body.thumbnail,
                    id: crearId(),
                    timestamp: new Date().toLocaleString(),
                    description: body.description,
                    code: body.code,
                    stock: body.stock
                }       
                this.productos.push(producto)
                return { agregado: producto }
            }else{
                const producto = {
                    title: body.title,
                    price: body.price,
                    thumbnail: body.thumbnail,
                    id: 1,
                    timestamp: new Date().toLocaleString(),
                    description: body.description,
                    code: body.code,
                    stock: body.stock
                }      
                this.productos = [producto]
                return { agregado: producto }
            }  
        }catch(err){
            console.log(err)
        }
    }

    async deleteById(id){
        try{
            const producto = this.productos.find(e => e.id == id)
            if(producto == undefined){
                return {'error': 'producto no encontrado'}
            }else{
                const indexDelProducto = this.productos.indexOf(producto)
                const eliminar = this.productos[indexDelProducto]               
                this.productos.splice(indexDelProducto, 1)
                return { productoEliminado: eliminar }
            }
        }catch(err){
            console.log(err)
        }
    }

    async changeById(id, body){
        try{
            const producto = this.productos.find(e => e.id == id)
            if(producto == undefined){
                const error =  {'error': 'producto no encontrado'}
                return error
            }else{
                const indexDelProducto = this.productos.indexOf(producto)
                if(body.title){ this.productos[indexDelProducto].title = body.nombre }
                if(body.price){ this.productos[indexDelProducto].price = body.price }
                if(body.thumbnail){ this.productos[indexDelProducto].thumbnail = body.thumbnail }    
                if(body.description){ this.productos[indexDelProducto].description = body.description }    
                if(body.code){ this.productos[indexDelProducto].code = body.code }    
                if(body.stock){ this.productos[indexDelProducto].stock = body.stock }    
                this.productos[indexDelProducto].timestamp = new Date().toLocaleString()
                return { seActualizo: this.productos[indexDelProducto] }
            }
        }catch(err){
            console.log(err)
        }
    }
}
module.exports = contenedorProductos