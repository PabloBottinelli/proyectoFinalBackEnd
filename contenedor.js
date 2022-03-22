const fs = require('fs')

module.exports = class Contenedor{
    constructor(archivo){
        this.archivo = archivo
    }
    
    async save(title, price) {
        const producto = {
            title: title,
            price: price,
            id: null
        }
        try{
            const contenido = await fs.promises.readFile(`./${this.archivo}`, 'utf-8')
            const products = JSON.parse(contenido);
            const i = products.length - 1 // no agarro directamente el length del array y le sumo 1 para el id del nuevo producto, porque si hago eso hay un error, al eliminar un elemento con deleteById y agregar uno nuevo, va a repetir el id del ultimo elemento del array. Asi que mejor agarro el id del ultimo elemento del array y le sumo 1
            producto.id = products[i].id +  1
            products.push(producto)
            await fs.promises.writeFile(`./${this.archivo}`, JSON.stringify(products)) 
            console.log(producto.id)
        }
        catch(err){
            console.log(err)
            const products = []
            producto.id = 1
            products.push(producto)
            console.log(producto.id)
            await fs.promises.writeFile(`./${this.archivo}`, JSON.stringify(products)) 
        }
    }

    async getById(id){
        try{
            const contenido = await fs.promises.readFile(`./${this.archivo}`, 'utf-8')
            const products = JSON.parse(contenido);
            const producto = products.find(e => e.id == id)
            return producto
        }
        catch{ 
            console.log(null)
        }
    }

    async getAll(){
        try{
            const contenido = await fs.promises.readFile(`./${this.archivo}`, 'utf-8')
            const products = JSON.parse(contenido);
            return products
        }
        catch(err){
            console.log('no hay nada en el archivo')
        }
    }

    async deleteById(idp){
        try{
            const contenido = await fs.promises.readFile(`./${this.archivo}`, 'utf-8')
            const products = JSON.parse(contenido);
            const eliminado = []
            for (let i = 0; i < products.length; i++) {
                if(products[i].id !== idp){
                    eliminado.push(products[i])
                    // console.log(eliminado)
                    await fs.promises.writeFile(`./${this.archivo}`, JSON.stringify(eliminado))
                }
            }
        }
        catch(err){
            console.log(err)
        }
    }

    async deleteAll(){
        try{
            await fs.promises.writeFile(`${this.archivo}`, '')
        }
        catch(err){
            console.log(err)
        }
    }
}

// let archivo = new Contenedor('productos.txt')
// archivo.save('Agenda', 234.56)
// archivo.deleteAll()
// archivo.getById(3)
// archivo.getAll()
// archivo.deleteById(3)
