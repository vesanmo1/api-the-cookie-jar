/*---------------------------------------------------------------------*\
 * Ruta de Cookies (controllers.js)
 * Este controlador maneja las solicitudes relacionadas con las cookies.
 
 * route {GET}    /cookies
 * route {GET}    /cookies/type/:type
 * route {POST}   /cookies
 * route {PUT}    /cookies/:_id
 * route {DELETE} /cookies/:_id
\*---------------------------------------------------------------------*/

const { Cookie } = require('./schemas')

const getCookies = async ( req , res , next) => {

    const search = await Cookie.find()
    
    res
        .status(200)
        .json({message : `Haciendo get en /cookies` , data : search})
}

const getCookiesByType = async ( req , res , next) => {

    const { type } = req.params

    const search = await Cookie.find({ type })

    res
        .status(201)
        .json({ message : `Mostrando todas las cookies que son ${type}` , data : search })
}

const postCookies = async ( req , res , next) => {

    const { cookie_name , description , type , img_url } = req.body

    const newCookie = new Cookie({
        cookie_name,
        description,
        type,
        img_url
    })

    await newCookie.save()
    const search = await Cookie.find()

    res
        .status(201)
        .json({     
            message: 'Añadiendo cookie',                    
            details: newCookie,
            data: search
        });  
}

const putCookies = async ( req , res , next) => {

    const { _id } = req.params
    const { cookie_name , description , type , img_url } = req.body

    const update = await Cookie.findByIdAndUpdate( _id , { cookie_name , description , type , img_url })

    const search = await Cookie.find()

    res
        .status(200)
        .json({     
            message: `Actualizando la cookie con _id ${_id}`,
            details: update,
            data: search
        }); 
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
    postCookies,
    putCookies,
    deleteCookies
}
