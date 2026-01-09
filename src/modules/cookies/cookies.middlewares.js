/*-----------------------------------------------------------------------------*\
 * Middlewares de Cookies
 *
 * Este archivo agrupa validaciones de parámetros de ruta y la configuración
 * de multer para la subida de imágenes.
 *
 * middleware {function} middlewareType       - Valida el parámetro :type.
 *                                            - Acepta "vegana" o "sin-gluten" (case-insensitive).
 *
 * middleware {function} middlewareVisible    - Valida el parámetro :visible.
 *                                            - Acepta únicamente "true" o "false".
 *
 * middleware {function} middlewareObjectId   - Valida el parámetro :_id como ObjectId de MongoDB.
 *                                            - Requiere 24 caracteres hexadecimales.
 *
 * middleware {multer}   uploadImage          - Middleware de multer para subir imágenes PNG.
 *                                            - Usa memoryStorage.
 *                                            - Solo permite mimetype "image/png".
 *                                            - Límite de tamaño: 3MB.
 *
 * middleware {function} maybeUploadImage     - Ejecuta uploadImage.single(fieldName) solo si la request
 *                                            viene en multipart/form-data; si no, pasa al siguiente middleware.
 *
 * Nota:
 * - La “conversión a WebP” no se realiza en este archivo. Aquí únicamente se valida y se carga el PNG
 *   en memoria para que otro paso (controller/servicio) procese y/o suba a Cloudinary.
 * - Se ha usado CHATGPT para los middlewares de subida de imágenes (MULTER)
\*-----------------------------------------------------------------------------*/

const multer = require("multer")

/* -------------------- VALIDACIONES -------------------- */

const middlewareType = ( req , res , next ) => {
    
    const {type} = req.params

    //USO DE CHATGPT para la expresión regular
    const validType = /^(vegana|sin-gluten)$/i.test(type.trim())
    console.log(validType)

    if( validType ){
        next()
    }else{
        let error = new Error (`El parámetro type no es válido`)
            error.status = 400
        next(error)
    }
}

const middlewareVisible = ( req , res , next ) => {
    console.log (`middlewareVisible`)

    const { visible } = req.params

    if (visible == 'true' || visible == 'false') {
        next()
    }else {
        let error = new Error (`El parámetro visible no es válido`)
            error.status = 400
        next(error)
    }
}

const middlewareObjectId = ( req , res , next ) => {

    const {_id} = req.params

    //USO DE CHATGPT para la expresión regular
    const objectIdRegex = /^[a-f\d]{24}$/i

    if (objectIdRegex.test(_id) && _id.length !==0) {
        next()
    }else {
        let error = new Error (`El parámetro _id no es un ObjectId`)
        error.status = 400
        next(error)
    }

}

//HECHO CON CHATGPT Y EJEMPLO DE CLASE
/* -------------------- MULTER (subida de imágenes) -------------------- */
/* --------------------- conversión de png a webp -----.---------------- */

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png") {
        cb(null, true)
    } else {
        const error = new Error("Solo se permiten imágenes PNG")
        error.status = 400
        cb(error)
    }
}

const uploadImage = multer({
    storage,
    fileFilter,
    limits: { fileSize: 3 * 1024 * 1024 } // 3MB
})

const maybeUploadImage = (fieldName) => (req, res, next) => {
    const contentType = req.headers["content-type"] || ""

    // Si viene FormData, ejecutamos multer
    if (contentType.includes("multipart/form-data")) {
        return uploadImage.single(fieldName)(req, res, next)
    }

    // Si viene JSON u otra cosa, NO ejecutamos multer
    return next()
}

module.exports = {
  middlewareType,
  middlewareVisible,
  middlewareObjectId,
  uploadImage,
  maybeUploadImage
}