/*-------------------------------------------------------------------------------------------*\
 * Router de cookies (router.js)
 * Este router maneja todas las solicitudes relacionadas con las cookies.
 
 * route {GET}    /             Nos muestra una lista de todas las cookies
 * route {POST}   /             Añade una nueva cookie y recibe los datos por body
 * route {PUT}    /:_id         Actualiza una cookie por su id y recibe los datos por body
 * route {DELETE} /:_id         Elimina una cookie por su id
 * route {GET}    /type/:type   Nos muestra las cookies filtradas por tipo (veganas, sin gluten)
\*-------------------------------------------------------------------------------------------*/

const express = require('express')


const { getCookies, postCookies, putCookies, deleteCookies, getCookiesByType } = require('./controllers')
const { middlewareObjectId, middlewareType } = require('./middlewares')

const router = express.Router()

    router.route('/')
        .get( getCookies )
        .post( postCookies )

    router.route('/:_id' )
        .put( middlewareObjectId , putCookies)
        .delete( middlewareObjectId , deleteCookies )

    router.route('/type/:type' )
        .get( middlewareType , getCookiesByType )

module.exports = {
    router
}