/*---------------------------------------------------------------------*\
 * Middlewares de la API de Cookies (middlewares.js)
 *
 * Estos middlewares manejan la autenticación, la validación de parámetros
 * y los errores de la API.
 *
 * @middleware {middlewareAuth}      Comprueba la cabecera secret-api-key para autorizar la petición
 * @middleware {middlewareType}      Valida el parámetro :type ("Vegana" | "Sin-gluten")
 * @middleware {middlewareVisible}   Valida el parámetro :visible (true | false)
 * @middleware {middlewareObjectId}      Valida el parámetro :_id como ObjectId de MongoDB
 * @middleware {uploadImage}             Multer: guarda el PNG en el public del FRONT
 * @middleware {middlewarePngToWebp}     Convierte el PNG subido a WEBP y lo guarda en el public del FRONT
 * @middleware {middleware404}       Gestiona las rutas no encontradas (404)
 * @middleware {middleware500}       Gestiona los errores del servidor (500)
\*---------------------------------------------------------------------*/

const {SECRET_API_KEY} = process.env

const multer = require("multer")
const path = require("path")
const sharp = require("sharp") 
const fs = require("fs")     

const middlewareAuth = ( req , res , next ) => {

    const { headers } = req

    if( headers['secret-api-key'] == SECRET_API_KEY ){
        next()
    }else{
        let error = new Error (`No tienes autorización para ver el contenido`)
            error.status = 403
        next(error)
    } 
}

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

// Rutas absolutas al public del FRONT (cookies-png y cookies-webp)
const FRONT_PUBLIC_DIR = path.join(__dirname, "..", "web-the-cookie-jar", "public")
const FRONT_PNG_DIR    = path.join(FRONT_PUBLIC_DIR, "cookies-png")                       
const FRONT_WEBP_DIR   = path.join(FRONT_PUBLIC_DIR, "cookies-webp")                     

// Aseguramos que existen las carpetas
if (!fs.existsSync(FRONT_PNG_DIR))  fs.mkdirSync(FRONT_PNG_DIR, { recursive: true })   
if (!fs.existsSync(FRONT_WEBP_DIR)) fs.mkdirSync(FRONT_WEBP_DIR, { recursive: true })     

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, FRONT_PNG_DIR) 
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const base = path.basename(file.originalname, ext).replaceAll(" ", "-")
        cb(null, `${Date.now()}_${base}${ext}`)
    }
})

// Aceptar SOLO PNG
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

//HECHO CON CHATGPT
/* -------------------- conversión de png a webp -------------------- */
const middlewarePngToWebp = async (req, res, next) => {
    try {

        if (!req.file) return next()

        const pngFilename = req.file.filename
        const pngPath = path.join(FRONT_PNG_DIR, pngFilename)

        const webpFilename = pngFilename.replace(path.extname(pngFilename), ".webp")
        const webpPath = path.join(FRONT_WEBP_DIR, webpFilename)

        await sharp(pngPath)
            .webp({ quality: 80 })
            .toFile(webpPath)

        // Lo dejamos disponible para el controller
        req.webpFilename = webpFilename

        next()

    } catch (error) {
        next(error)
    }
}

/* -------------------- ERRORES -------------------- */

const middleware404 = ( req , res , next ) => {
        const error = new Error()
              error.message = `El endpoint al que llamas no existe`
              error.status  = 404 
            next(error)
    }
  
const middleware500 = ( error , req , res , next ) => {
        let status = error.status || 500
        res.status(status).json(`${error.message}`)
    }


module.exports = {
    middlewareAuth,
    middlewareType,
    middlewareVisible,
    middlewareObjectId,
    uploadImage,
    middlewarePngToWebp,
    middleware404,
    middleware500
}