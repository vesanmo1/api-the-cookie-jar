console.clear()
console.log(`Iniciando The Cookie Jar`)

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

require('dotenv').config()

const { PORT , MONGO_URL } = process.env

const { middlewareAuth, middleware404, middleware500 } = require('./middlewares')
const { router } = require('./router')

const connect = async () => {

    await mongoose.connect(MONGO_URL)
        .then ( ()=> console.log('🌿 Conectado a MongoDB'))
        .catch (error => console.log(error.message))

}

connect()

const app = express()

    app.use( cors() )
    app.use( express.json() )
    app.use( express.urlencoded({ extended : false }) )

    app.use( middlewareAuth )

    app.use( '/cookies' , router )

    app.use( middleware404 )
    app.use( middleware500 )
    


app.listen( PORT , ()=> {
    console.log(`Iniciando API en el puesrto ${PORT}`)
}) 