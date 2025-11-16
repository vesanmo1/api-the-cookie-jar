/*---------------------------------------------------------------*\
 * The Cookie Jar / Express API

 * Conectamos con la base de datos de cookies para gestionar 
 * la información y servirla a los clientes.
 
 * @middlewares {cors, middlewareAuth, middleware404, middleware500}
 * @routing     {Express Router}
 * @odm         {mongoose}
 
 * @endpoint    {/cookies}                 [get, post]
 * @endpoint    {/cookies/:_id}            [put, delete]
 * @endpoint    {/cookies/type/:type}      [get]
\*---------------------------------------------------------------*/

// Limpia la consola cada vez que se inicia la aplicación
console.clear()
console.log(`Iniciando The Cookie Jar`)

// Importación de dependencias externas
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

// Carga las variables de entorno desde el archivo .env
require('dotenv').config()

// Desestructuramos las variables de entorno necesarias
const { PORT , MONGO_URL } = process.env

// Importación de middlewares y router propios de la aplicación
const { middlewareAuth, middleware404, middleware500 } = require('./middlewares')
const { router } = require('./router')

// Función asíncrona que establece la conexión con la base de datos MongoDB
const connect = async () => {

    await mongoose.connect(MONGO_URL)
        .then ( ()=> console.log('🌿 Conectado a MongoDB'))
        .catch (error => console.log(error.message))

}

// Llamada inicial para conectar con la base de datos al arrancar la API
connect()

// Creación de la aplicación de Express
const app = express()

    // ----- MIDDLEWARES GLOBALES -----

    // Habilita CORS para permitir peticiones desde otros orígenes
    app.use( cors() )

    // Permite parsear el cuerpo de las peticiones con formato JSON
    app.use( express.json() )

    // Permite parsear datos codificados en URL (formularios, etc.)
    app.use( express.urlencoded({ extended : false }) )

    // Middleware de autenticación que se ejecuta antes de las rutas protegidas
    app.use( middlewareAuth )

    // ----- RUTAS PRINCIPALES -----

    // Todas las rutas relacionadas con "cookies" se delegan al router correspondiente
    app.use( '/cookies' , router )

    // ----- MIDDLEWARES DE GESTIÓN DE ERRORES -----

    // Middleware para manejar rutas no encontradas (404)
    app.use( middleware404 )

    // Middleware para manejar errores internos del servidor (500)
    app.use( middleware500 )
    

// ----- INICIO DEL SERVIDOR -----

// Arranca el servidor HTTP en el puerto indicado en las variables de entorno
app.listen( PORT , ()=> {
    console.log(`Iniciando API en el puesrto ${PORT}`)
}) 
