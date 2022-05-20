class contenedorCarrito{
    constructor(carritos){
        this.carritos = carritos
    }

    async getAll(){
        try{ 
            return this.carritos
        }catch(err){
            console.log(err)
        }
    }

    async getProducts(id){
        try{
            const carrito = this.carritos.find(e => e.id == id)
            if(carrito == undefined){
                const error =  {'error': 'carrito no encontrado'}
                return error
            }else{
                return carrito.products
            }
        }catch(err){
            console.log(err)
        }
    }

    async save(){        
        try{   
            if(this.carritos){
                const crearId = () => {
                    const i = this.carritos.length - 1 // no agarro directamente el length del array y le sumo 1 para el id del nuevo producto, porque si hago eso hay un error, al eliminar un elemento con deleteById y agregar uno nuevo, va a repetir el id del ultimo elemento del array. Asi que mejor agarro el id del ultimo elemento del array y le sumo 1
                    const id = this.carritos[i].id +  1
                    return id
                }
                const carrito = {
                    id: crearId(),
                    timestamp: new Date().toLocaleString(),
                    products: []
                }       
                this.carritos.push(carrito)
                return { carritoCreado: carrito }
            }else{
                const carrito = {
                    id: 1,
                    timestamp: new Date().toLocaleString(),
                    products: []
                }      
                this.carritos = [carrito]
                return { carritoCreado: carrito }
            }  
        }catch(err){
            console.log(err)
        }
    }

    async addProduct(id, product){
        try{
            const carrito = this.carritos.find(e => e.id == id)
            if(carrito){
                const indexDelCarrito = this.carritos.indexOf(carrito)
                this.carritos[indexDelCarrito].products.push(product)
                return { productoAgregadoAlCarrito: product }
            }else{
                return { error: 'No se encontro el carrito' }
            }
        }catch(err){
            console.log(err)
        }
    }

    async deleteById(id){
        try{
            const carrito = this.carritos.find(e => e.id == id)
            if(carrito == undefined){
                return { 'error': 'carrito no encontrado' }
            }else{
                const indexDelCarrito = this.carritos.indexOf(carrito)
                const eliminar = this.carritos[indexDelCarrito]               
                this.carritos.splice(indexDelCarrito, 1)
                return { carritoEliminado: eliminar }
            }
        }catch(err){
            console.log(err)
        }
    }

    async deleteProduct(id, id_prod){
        try{
            const carrito = this.carritos.find(e => e.id == id)
            if(carrito){
                const indexDelCarrito = this.carritos.indexOf(carrito)
                const producto = this.carritos[indexDelCarrito].products.find( x => x.id === parseInt(id_prod))
                if(producto){
                    const indexDelProducto = this.carritos[indexDelCarrito].products.indexOf(producto)
                    const eliminar = this.carritos[indexDelCarrito].products[indexDelProducto]
                    this.carritos[indexDelCarrito].products.splice(indexDelProducto, 1)
                    return { eliminado: eliminar }
                }else{
                    return { error: 'No se encontro el producto' }
                }
            }else{
                return { error: 'No se encontro el carrito' }
            }
        }catch(err){
            console.log(err)
        }
    }
}
module.exports = contenedorCarrito