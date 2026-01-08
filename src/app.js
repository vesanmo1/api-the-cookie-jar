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

// Importación de dependencias externas
const express = require('express')
const cors = require('cors')

// Importación de middlewares y routers propios de la aplicación
const { middlewareAuth } = require("./modules/auth/auth.middlewares")
const { router: cookiesRouter } = require("./modules/cookies/cookies.router")
const { router: authRouter } = require("./modules/auth/auth.router")

// Middlewares de gestión de errores (/src/middlewares)
const { middleware404 } = require("./middlewares/error404")
const { middleware500 } = require("./middlewares/error500")

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

    // Auth aplicado a /cookies
    app.use("/cookies", middlewareAuth, cookiesRouter)

    // Rutas de autenticación (login)
    //app.use("/auth", authRouter)

// ----- MIDDLEWARES DE GESTIÓN DE ERRORES -----

    app.use(middleware404)
    app.use(middleware500)

module.exports = { app }