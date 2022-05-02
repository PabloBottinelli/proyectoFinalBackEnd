const { db } = require('../db/database.js')

class contenedorProductos{
    constructor(tableName){
        this.table = tableName
        this.knex = require('knex')(db)
    }
    
    async createTable(){
        await this.knex.schema.createTableIfNotExists(this.table, (table) => {
            table.increments("id");
            table.string("title");
            table.float("price");
            table.string("thumbnail");
        })
        .finally(() => {
            this.knex.destroy()
        })
    }

    async getAll(){
        try{ 
            return await this.knex.from(this.table).select("*")
            .finally(() => {
                this.knex.destroy()
            })
        }catch(err){
            console.log(err)
        }
    }
  
    async getById(id){
        try{
            const producto = await this.knex.from(this.table).where('id', '=', id)
            .finally(() => {
                this.knex.destroy()
            })
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
            return await this.knex(this.table).insert([body])
            .finally(() => {
                this.knex.destroy()
            })
        }catch(err){
            console.log(err)
        }
    }

    async deleteById(id){
        try{
            return await this.knex(this.table).where('id', '=', id).del()
            .finally(() => {
                this.knex.destroy()
            })
        }catch(err){
            console.log(err)
        }
    }

    async changeById(id, body){
        try{
            await this.knex(this.table).where('id', '=', id).update({ title: body.title, price: body.price, thumbnail: body.thumbnail })
            .finally(() => {
                this.knex.destroy()
            })
        }catch(err){
            console.log(err)
        }
    }
}
module.exports = contenedorProductos