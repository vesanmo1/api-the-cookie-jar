/*---------------------------------------------------------------------*\
 * Middlewares de la API de Cookies (middlewares.js)
 *
 * Estos middlewares manejan la autenticación, la validación de parámetros
 * y los errores de la API.
 *
 * @middleware {middlewareAuth}          Comprueba la cabecera secret-api-key para autorizar la petición
 * @middleware {middlewareType}          Valida el parámetro :type ("Vegana" | "Sin-gluten")
 * @middleware {middlewareVisible}       Valida el parámetro :visible (true | false)
 * @middleware {middlewareObjectId}      Valida el parámetro :_id como ObjectId de MongoDB
 * @middleware {uploadImage}             Multer: guarda el archivo en MEMORIA (req.file.buffer) para subirlo a Cloudinary
 * @middleware {middleware404}           Gestiona las rutas no encontradas (404)
 * @middleware {middleware500}           Gestiona los errores del servidor (500)
\*---------------------------------------------------------------------*/

 const {SECRET_API_KEY} = process.env

 const multer = require("multer")

/* -------------------- AUTH -------------------- */

const middlewareAuth = ( req , res , next ) => {

    // Clave para que en PRODUCCIÓN no falle CORS.
    if (req.method === "OPTIONS") return next()

    const { headers } = req

    if( headers['secret-api-key'] == SECRET_API_KEY ){
        next()
    }else{
        let error = new Error (`No tienes autorización para ver el contenido`)
            error.status = 403
        next(error)
    } 
}

/* -------------------- VALIDACIONES -------------------- */

const middlewareType = ( req , res , next ) => {
    
    const {type} = req.params

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
/* -------------------- conversión de png a webp -------------------- */

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

/* -------------------- ERRORES -------------------- */

const middleware404 = ( req , res , next ) => {
        const error = new Error()
              error.message = `El endpoint al que llamas no existe`
              error.status  = 404 
            next(error)
    }
  
const middleware500 = ( error , req , res , next ) => {
    let status = error.status || 500
    res.status(status).json({ message: error.message, data: null })
}


module.exports = {
    middlewareAuth,
    middlewareType,
    middlewareVisible,
    middlewareObjectId,
    uploadImage,
    middleware404,
    middleware500
}