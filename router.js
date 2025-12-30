/*-------------------------------------------------------------------------------------------------------*\
 * Router de cookies (router.js)
 * Este router maneja todas las solicitudes relacionadas con las cookies.
 
 * route {GET}    /                     Nos muestra una lista de todas las cookies
 * route {POST}   /                     Añade una nueva cookie y recibe los datos por body
 * route {PUT}    /:_id                 Actualiza una cookie por su id y recibe los datos por body
 * route {DELETE} /:_id                 Elimina una cookie por su id
 * route {GET}    /type/:type           Nos muestra las cookies filtradas por tipo (veganas, sin gluten)
 * route {GET}    /visible/:visible     Nos muestra las cookies filtradas por visible (true, false)
\*-------------------------------------------------------------------------------------------------------*/

const express = require('express')


const { getCookies, postCookies, putCookies, deleteCookies, getCookiesByType, getCookiesByVisibility } = require('./controllers')
const { middlewareObjectId, middlewareType, middlewareVisible, uploadImage } = require('./middlewares')

const router = express.Router()

    router.route('/')
        .get( getCookies )
        //Multer antes del controller. El nombre del campo file: "image_png"
        .post(uploadImage.single("image_png"), postCookies) 

    router.route('/:_id' )
        // Multer también en PUT
        .put(middlewareObjectId, uploadImage.single("image_png"), putCookies)
        .delete( middlewareObjectId , deleteCookies )

    router.route('/type/:type' )
        .get( middlewareType , getCookiesByType )
        
    router.route('/visible/:visible')
        .get( middlewareVisible , getCookiesByVisibility)

module.exports = {
    router
}