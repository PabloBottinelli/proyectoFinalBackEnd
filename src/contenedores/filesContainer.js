const fs = require("fs")

class ContenedorArchivo {
  constructor(path){
    this.path = path
  }

  async save(obj) {
    try{
      let objetos = await this.getAll()
      const array = objetos.map((x) => x.id)
      if(array.length == 0){
        obj.id = 1
      }else{
        obj.id = Math.max(...array) + 1
      }
      const time = new Date()
      const newElem = { ...obj, fyh: time.toLocaleString() }
      objetos.push(newElem)
      objetos = JSON.stringify(objetos, null, 2)
      await fs.promises.writeFile(this.path, objetos)
      return obj.id
    }catch(error){
      console.log(error)
    }
  }

  async getAll(){
    try {
      let contenido = await fs.readFileSync(this.path, this.encoding)
      if (contenido == "") {
        return []
      }
      const array = JSON.parse(contenido)
      return array
    }catch(error){
      console.log(error)
      return []
    }
  }

  async deleteAll() {
    try{
      await fs.promises.writeFile(this.path, "")
      console.log("Borrado")
    }catch(error){
      console.log(error)
    }
  }
}

module.exports = ContenedorArchivo;