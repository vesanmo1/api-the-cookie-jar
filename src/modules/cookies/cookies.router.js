/*-------------------------------------------------------------------------------------------------------*\
 * Router de Cookies
 *
 * Este router define las rutas HTTP relacionadas con las cookies y conecta
 * cada endpoint con sus middlewares y controllers correspondientes.
 *
 * route {GET}    /                     Lista todas las cookies.
 * route {POST}   /                     Crea una nueva cookie y sube la imagen "image_png".
 * route {PUT}    /:_id                 Actualiza una cookie por su id, valida ObjectId y permite subir "image_png" opcional.
 * route {PATCH}  /:_id                 Actualiza SOLO la visibilidad de una cookie por su id (valida ObjectId).
 * route {DELETE} /:_id                 Elimina una cookie por su id y valida ObjectId.
 * route {GET}    /type/:type           Lista cookies filtradas por tipo (valida el parámetro :type).
 * route {GET}    /visible/:visible     Lista cookies filtradas por visibilidad (valida el parámetro :visible).
 *
 * Nota:
 * - POST usa uploadImage.single("image_png") para obligar a recibir/subir la imagen.
 * - PUT usa maybeUploadImage("image_png") para subirla solo si viene en la request.
 * - PATCH no usa subida de imagen: solo cambia el campo "visible" (true | false).
\*-------------------------------------------------------------------------------------------------------*/

const express = require('express')


const { getCookies, getCookiesByType, getCookiesByVisibility, postCookies, putCookies, patchCookiesVisibility, deleteCookies } = require('./cookies.controllers')
const { middlewareObjectId, middlewareType, middlewareVisible, uploadImage, maybeUploadImage } = require('./cookies.middlewares')

const cookiesRouter = express.Router()

    cookiesRouter.route('/')
        .get( getCookies )
        .post( uploadImage.single("image_png"), postCookies )

    cookiesRouter.route('/:_id')
        .put( middlewareObjectId, maybeUploadImage("image_png"), putCookies )
        .patch( middlewareObjectId, patchCookiesVisibility )
        .delete( middlewareObjectId, deleteCookies )        

    cookiesRouter.route('/type/:type')
        .get( middlewareType , getCookiesByType )
        
    cookiesRouter.route('/visible/:visible')
        .get( middlewareVisible , getCookiesByVisibility )

module.exports = {
    cookiesRouter
}
