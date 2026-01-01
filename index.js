/*---------------------------------------------------------------*\
 * The Cookie Jar / Express API
 *
 * API REST para gestionar cookies y sus imágenes.
 * Conecta con MongoDB (Mongoose) y recibe imágenes vía Multer (memoria)
 * para subirlas a Cloudinary (sin almacenamiento en disco).
 *
 * @middlewares {cors, middlewareAuth, middleware404, middleware500}
 * @routing     {Express Router}
 * @odm         {mongoose}
 * @service     {Cloudinary}
 *
 * @endpoint    {/cookies}                 [get, post]
 * @endpoint    {/cookies/:_id}            [put, delete]
 * @endpoint    {/cookies/type/:type}      [get]
 * @endpoint    {/cookies/visible/:visible}[get]
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
    app.use((req, res, next) => {
        if (req.method === "OPTIONS") return cors()(req, res, next)
        next()
    })

    // Permite parsear el cuerpo de las peticiones con formato JSON
    app.use( express.json() )

    // Permite parsear datos codificados en URL (formularios, etc.)
    app.use( express.urlencoded({ extended : false }) )

// ----- RUTAS PRINCIPALES -----

// CAMBIO: auth solo para /cookies (más limpio que global)
    app.use('/cookies', middlewareAuth, router)

// ----- MIDDLEWARES DE GESTIÓN DE ERRORES -----

    app.use(middleware404)
    app.use(middleware500)

// ----- INICIO DEL SERVIDOR -----

// Arranca el servidor HTTP en el puerto indicado en las variables de entorno
app.listen( PORT , ()=> {
    console.log(`Iniciando API en el puesrto ${PORT}`)
}) 


