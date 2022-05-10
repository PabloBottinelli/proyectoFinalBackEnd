require('dotenv').config()
const admin = require("firebase-admin")

const serviceAccount = require('./db/proyectoback-3228f-firebase-adminsdk-upbgr-609f77fdcb.json')

module.exports = {
  ENV: {
    PORT: process.env.PORT || 8080,
    PERS: process.env.PERS || 'mongo', // firebase, mongo 
  },
  DB_CONFIG: {
    mongodb: {
      url: process.env.URL_MONGODB
    },
    firebase: {
      credential: admin.credential.cert(serviceAccount)
    }
  }
}