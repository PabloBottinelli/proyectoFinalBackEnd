const { dbMsgs } = require('../../db/dbsqlite3.js')

class contenedorMsgs{
    constructor(tableName){
        this.table = tableName
        this.knex = require('knex')(dbMsgs)
        this.createTable()
    }
    
    async createTable(){
        await this.knex.schema.createTableIfNotExists(this.table, (table) => {
            table.increments('id')
            table.string('username')
            table.text('content')
            table.date('fyh')
        })
    }

    async getAll(){
        try{ 
            return await this.knex.from(this.table).select("*")
        }catch(err){
            console.log(err)
        }
    }
  
    async getById(id){
        try{
            const producto = await this.knex.from(this.table).where('id', '=', id)
            if(producto.length == 0){
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
        }catch(err){
            console.log(err)
        }
    }

    async deleteById(id){
        try{
            return await this.knex(this.table).where('id', '=', id).del()
        }catch(err){
            console.log(err)
        }
    }

    async changeById(id, body){
        try{
            await this.knex(this.table).where('id', '=', id).update({ title: body.title, price: body.price, thumbnail: body.thumbnail })
        }catch(err){
            console.log(err)
        }
    }
}
module.exports = contenedorMsgs