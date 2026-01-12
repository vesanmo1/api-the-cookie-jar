/*-----------------------------------------------------------------------------*\
 * The Cookie Jar / Express API (app.js)
 *
 * API REST para gestionar cookies y sus imágenes.
 * Conecta con MongoDB (vía Mongoose en el módulo de conexión) y expone endpoints
 * para CRUD y filtros. Las imágenes se reciben con Multer (configurado en el módulo
 * de cookies) y se suben a Cloudinary (sin almacenamiento en disco).
 *
 * middlewares {cors}                     - Habilita CORS (incluye preflight OPTIONS).
 * middlewares {express.json}             - Parseo de JSON.
 * middlewares {express.urlencoded}       - Parseo de x-www-form-urlencoded.
 * middlewares {middleware404}            - Rutas no encontradas (404).
 * middlewares {middleware500}            - Gestión global de errores (status y mensaje).
 *
 * routing {router} /cookies              - Rutas del recurso cookies.
 * routing {router} /auth                 - Rutas de autenticación.
 *
 * endpoints:
 * endpoint {/cookies}                    - [GET, POST]
 * endpoint {/cookies/:_id}               - [PUT, DELETE]
 * endpoint {/cookies/type/:type}         - [GET]
 * endpoint {/cookies/visible/:visible}   - [GET]
 * endpoint {/auth}                       - [POST]
\*-----------------------------------------------------------------------------*/

// Importación de dependencias externas
const express = require('express')
const cors = require('cors')

// Importación de routers de la aplicación
const { cookiesRouter } = require("./modules/cookies/cookies.router")
const { authRouter } = require("./modules/auth/auth.router")

// Middlewares de gestión de errores
const { middleware404 } = require("./middlewares/error404")
const { middleware500 } = require("./middlewares/error500")

// Creación de la aplicación de Express
const app = express()

    /* -------------------- MIDDLEWARES GLOBALES -------------------- */

    // Habilita CORS para permitir peticiones desde otros orígenes
    app.use( cors() )

    // Permite parsear el cuerpo de las peticiones con formato JSON
    app.use( express.json() )

    // Permite parsear datos codificados en URL (formularios, etc.)
    app.use( express.urlencoded({ extended : false }) )


    /* -------------------- RUTAS PRINCIPALES -------------------- */

    // Rutas del recurso cookies
    app.use("/cookies", cookiesRouter)

    // Rutas de autenticación (login)
    app.use("/auth", authRouter)

    /* ------------ MIDDLEWARES DE GESTIÓN DE ERRORES ------------ */

    app.use(middleware404)
    app.use(middleware500)

module.exports = { app }