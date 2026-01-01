/*---------------------------------------------------------------------*\
 * The Cookie Jar / Cookies Controller (controllers.js)
 *
 * Controlador para gestionar las cookies y sus filtros.
 * Incluye subida de imágenes a Cloudinary usando Multer en memoria:
 * - La imagen llega en req.file.buffer
 * - Se sube UNA sola vez a Cloudinary
 * - Se guarda la URL (secure_url) y el public_id en MongoDB
 * - La versión WebP se obtiene automáticamente mediante transformaciones
 *   de Cloudinary (f_auto / f_webp), sin doble subida
 *
 * @odm         {mongoose}
 * @model       {Cookie}
 * @service     {Cloudinary}
 * @upload      {multer memoryStorage}
 *
 * @route {GET}    /cookies
 * @route {GET}    /cookies/type/:type
 * @route {GET}    /cookies/visible/:visible
 * @route {POST}   /cookies
 * @route {PUT}    /cookies/:_id
 * @route {DELETE} /cookies/:_id
\*---------------------------------------------------------------------*/

const { Cookie } = require('./schemas')

const cloudinary = require('./cloudinary')
const streamifier = require('streamifier')

//HECHO CON CHATGPT Y EJEMPLO DE CLASE
// Helper para subir buffer a Cloudinary (patrón típico de clase)
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
    // Mapeo de slug (URL) → valor tal y como está en la BD
    const TYPE_MAP = {
        "vegana": "Vegana",
        "sin-gluten": "Sin gluten",
    }

    const dbType = TYPE_MAP[type] || type

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

        const { cookie_name , description , types , visible } = req.body

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
        const { cookie_name , description , types , visible } = req.body

        let updateData = { cookie_name , description , types , visible }

        //MULTER: CON CHATGPT        

        if (req.file) {

            const result = await uploadBufferToCloudinary(req.file.buffer, {
                folder: "the-cookie-jar",
                resource_type: "image"
            })

            updateData.image_png = result.secure_url
            updateData.image_public_id = result.public_id
        }

        const update = await Cookie.findByIdAndUpdate(
            _id,
            updateData,
            { new: true }
        )

        const search = await Cookie.find()

        res
            .status(200)
            .json({
                message: `Actualizando la cookie con _id ${_id}`,
                details: update,
                data: search
            })

    } catch (error) {
        next(error)
    }
}

const deleteCookies = async ( req , res , next) => {

    const { _id } = req.params

    const deleteCookie = await Cookie.findByIdAndDelete( _id )

    const search = await Cookie.find()

    res
        .status(200)
        .json({
            message : `Eliminando la cookie con _id ${_id}`,
            details: deleteCookie,
            data : search
        })
}



module.exports = {
    getCookies,
    getCookiesByType,
    getCookiesByVisibility,
    postCookies,
    putCookies,
    deleteCookies
}
