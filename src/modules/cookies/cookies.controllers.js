/*-----------------------------------------------------------------------------*\
 * Controlador de Cookies (cookies.controllers.js)
 *
 * Este controlador gestiona el recurso "cookies" y sus filtros.
 * Incluye integración con Multer en memoria + Cloudinary:
 * - La imagen llega en req.file.buffer (multer.memoryStorage()).
 * - Se sube UNA sola vez a Cloudinary mediante upload_stream (sin guardar en disco).
 * - Se guarda en MongoDB:
 *   - image_png: URL segura (secure_url).
 *   - image_public_id: public_id para borrados y transformaciones.
 * - La versión WebP NO se almacena: se obtiene mediante transformaciones de Cloudinary
 *   (por ejemplo usando f_auto / f_webp en la URL).
 *
 * route {GET}    /cookies                  Lista todas las cookies.
 * route {GET}    /cookies/type/:type       Lista cookies filtradas por tipo (vegana | sin-gluten).
 * route {GET}    /cookies/visible/:visible Lista cookies filtradas por visibilidad (true | false).
 * route {POST}   /cookies                  Crea una cookie (requiere imagen PNG).
 * route {PUT}    /cookies/:_id             Actualiza una cookie. Reemplaza imagen si llega req.file.
 * route {DELETE} /cookies/:_id             Elimina una cookie y borra su imagen en Cloudinary.
 *
 * Nota:
 * - Ayuda de CHATGPT en put y post para integrar el uso de imagenes con multer y cloudinary
 *   en deleteCookie se ha añadido la misma lógica que en put para eliminar las imagenes de Cloudinary y no dejar archivos huérfanos
 * - Si falla el borrado en Cloudinary, no se aborta la operación: se continúa con la actualización/borrado en Mongo.
\*-----------------------------------------------------------------------------*/

const { Cookie } = require("./cookies.schemas")

const cloudinary = require("../../config/cloudinary")
const streamifier = require("streamifier")

//HECHO CON CHATGPT
// Helper para subir buffer a Cloudinary
const uploadBufferToCloudinary = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) return reject(error)
                resolve(result)
            }
        )

        streamifier.createReadStream(buffer).pipe(stream)
    })
}

const getCookies = async ( req , res , next) => {

    const search = await Cookie.find()
    
    res
        .status(200)
        .json({message : `Haciendo get en /cookies` , data : search})
}

const getCookiesByType = async ( req , res , next) => {

    const { type } = req.params

    // HECHO CON CHATGPT
    // Diccionario (TYPE_MAP) que traduce:
    //   "vegana"     -> "Vegana"
    //   "sin-gluten" -> "Sin gluten"
    const TYPE_MAP = {
        "vegana": "Vegana",
        "sin-gluten": "Sin gluten",
    }

    const dbType = TYPE_MAP[type]

    const search = await Cookie.find({ types: dbType })

    res
        .status(200)
        .json({ message : `Mostrando todas las cookies que son ${type}` , data : search })
}

const getCookiesByVisibility = async ( req, res , next ) => {

    const { visible } = req.params

    /*-------------------------------*\
    * 'true' === 'true'    // true
    * 'false' === 'true'   // false
    \*-------------------------------*/
    const visibleBool = (visible === 'true')

    const search = await Cookie.find({ visible: visibleBool })

    res
        .status(200)
        .json({message : `Mostrando a todas la cookies con visibilidad: ${visible}` , data : search})
}

const postCookies = async ( req , res , next) => {

    try {

        const { cookie_name , description } = req.body

        let types = []
        if (req.body.types) {
            try { types = JSON.parse(req.body.types) } catch { types = [] }
        }

        const visible = (req.body.visible === "true" || req.body.visible === true)

        if (!req.file) {
            const error = new Error("Falta la imagen PNG")
            error.status = 400
            throw error
        }

        const result = await uploadBufferToCloudinary(req.file.buffer, {
        folder: "the-cookie-jar",
        resource_type: "image"
        })

        const newCookie = new Cookie({
            cookie_name,
            description,
            types,
            image_png: result.secure_url,
            image_public_id: result.public_id,
            visible
        })

        await newCookie.save()
        const search = await Cookie.find()

        res
            .status(201)
            .json({
                message: "Añadiendo cookie",
                details: newCookie,
                data: search
            })

    } catch (error) {
        next(error)
    }
}

const putCookies = async ( req , res , next) => {

    try {

        const { _id } = req.params
        const { cookie_name , description } = req.body

        let { types } = req.body
        if (typeof types === "string") {
            try { types = JSON.parse(types) } catch { types = [] }
        } else if (!Array.isArray(types)) {
            types = []
        }

        let { visible } = req.body
        if (typeof visible === "string") visible = visible === "true"
        else visible = !!visible

        // Base update (sin imagen)
        let updateData = { cookie_name, description, types, visible }

        // Si viene archivo nuevo => reemplazar imagen
        if (req.file) {

        // 1) Buscar cookie actual para saber qué public_id borrar
        const current = await Cookie.findById(_id)
        if (!current) {
            const error = new Error("Cookie no encontrada")
            error.status = 404
            throw error
        }

        // 2) Borrar imagen anterior en Cloudinary (si existe)
        if (current.image_public_id) {
            try {
            await cloudinary.uploader.destroy(current.image_public_id, { resource_type: "image" })
            } catch (err) {
            // No abortamos la operación si falla el borrado, pero lo registras
            console.log("Error borrando imagen anterior en Cloudinary:", err)
            }
        }

        // 3) Subir imagen nueva
        const result = await uploadBufferToCloudinary(req.file.buffer, {
            folder: "the-cookie-jar",
            resource_type: "image",
        })

        updateData.image_png = result.secure_url
        updateData.image_public_id = result.public_id
        }

        const update = await Cookie.findByIdAndUpdate(_id, updateData, { new: true })
        const search = await Cookie.find()

        res.status(200).json({
        message: `Actualizando la cookie con _id ${_id}`,
        details: update,
        data: search,
        })

    } catch (error) {
        next(error)
    }
}

const deleteCookies = async ( req , res , next) => {

    try {
        const { _id } = req.params

        // 1) Buscar la cookie para saber qué imagen borrar
        const cookie = await Cookie.findById(_id)
        if (!cookie) {
            const error = new Error("Cookie no encontrada")
            error.status = 404
            throw error
        }

        // 2) Borrar imagen en Cloudinary si existe
        if (cookie.image_public_id) {
            try {
                await cloudinary.uploader.destroy(cookie.image_public_id, { resource_type: "image" })
            } catch (err) {
                // No abortamos: borramos igual la cookie aunque falle Cloudinary
                console.log("Error borrando imagen en Cloudinary:", err)
            }
        }

        // 3) Borrar cookie en Mongo
        const deleted = await Cookie.findByIdAndDelete(_id)

        // 4) Devolver lista actualizada (siguiendo tu patrón)
        const search = await Cookie.find()

        res
            .status(200)
            .json({
                message : `Eliminando la cookie con _id ${_id}`,
                details: deleted,
                data : search
            })

    } catch (error) {
        next(error)
    }
}



module.exports = {
    getCookies,
    getCookiesByType,
    getCookiesByVisibility,
    postCookies,
    putCookies,
    deleteCookies
}
