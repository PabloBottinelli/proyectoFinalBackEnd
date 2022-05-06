
const admin = require("firebase-admin");

const serviceAccount = require("./db/proyectoback-3228f-firebase-adminsdk-upbgr-609f77fdcb.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log('Conectado a la base de datos')

crud()

async function crud(){
    const db = admin.firestore()
    const query = db.collection('usuarios')

    try {
        const doc = query.doc()
        await doc.create({nombre: 'Jose', dni: 43920119})
        await doc.create({nombre: 'Pablo', dni: 43920119})
        await doc.create({nombre: 'Maria', dni: 43920119})
        console.log('Datos insertados')
    }catch(err){
        console.log(err)
    }
}