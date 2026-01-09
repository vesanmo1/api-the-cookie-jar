/*-------------------------------------------------------------------------------------------------------*\
 * Router de Cookies
 *
 * Este router define las rutas HTTP relacionadas con las cookies y conecta
 * cada endpoint con sus middlewares y controllers correspondientes.
 *
 * route {GET}    /                     Lista todas las cookies.
 * route {POST}   /                     Crea una nueva cookie (requiere auth) y sube la imagen "image_png".
 * route {PUT}    /:_id                 Actualiza una cookie por su id (requiere auth), valida ObjectId y permite subir "image_png" opcional.
 * route {DELETE} /:_id                 Elimina una cookie por su id (requiere auth) y valida ObjectId.
 * route {GET}    /type/:type           Lista cookies filtradas por tipo (valida el parámetro :type).
 * route {GET}    /visible/:visible     Lista cookies filtradas por visibilidad (valida el parámetro :visible).
 *
 * Nota:
 * - POST usa uploadImage.single("image_png") para obligar a recibir/subir la imagen.
 * - PUT usa maybeUploadImage("image_png") para subirla solo si viene en la request.
\*-------------------------------------------------------------------------------------------------------*/

const express = require('express')


const { getCookies, getCookiesByType, getCookiesByVisibility, postCookies, putCookies, deleteCookies } = require('./cookies.controllers')
const { middlewareObjectId, middlewareType, middlewareVisible, uploadImage, maybeUploadImage } = require('./cookies.middlewares')
const { middlewareAuth } = require("../auth/auth.middlewares")

const router = express.Router()

    router.route('/')
        .get( getCookies )
        .post(middlewareAuth, uploadImage.single("image_png"), postCookies)

    router.route('/:_id' )
        .put(middlewareAuth, middlewareObjectId, maybeUploadImage("image_png"), putCookies)
        .delete(middlewareAuth, middlewareObjectId, deleteCookies)

    router.route('/type/:type' )
        .get( middlewareType , getCookiesByType )
        
    router.route('/visible/:visible')
        .get( middlewareVisible , getCookiesByVisibility)

module.exports = {
    router
}
