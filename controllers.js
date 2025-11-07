const getCookies = ( req , res , next) => {
    res
        .status(200)
        .json({message : `Haciendo get en / cookies` , data : []})
}

const getCookiesByType = ( req , res , next) => {

    const { type } = req.params
    res
        .status(201)
        .json({ message : `Mostrando todas las galletas ${type}` , data : [] })
}

const postCookies = ( req , res , next) => {

    const { cookie_img , cookie_name , description , type } = req.body

    res
        .status(201)
        .json({     message: 'Añadiendo cookie',
                    cookie_img,
                    cookie_name,
                    description,
                    type,
                    data: []});  
}

const putCookies = ( req , res , next) => {

    const { _id } = req.params
    const { cookie_img , cookie_name , description , type } = req.body

    res
        .status(200)
        .json({     message: `Actualizando la cookie con _id ${_id}`,
                    cookie_img,
                    cookie_name,
                    description,
                    type,
                    data: []});  
}

const deleteCookies = ( req , res , next) => {

    const { _id } = req.params

    res
        .status(200)
        .json({message : `Eliminando la cookie con _id ${_id}` , data : []})
}



module.exports = {
    getCookies,
    getCookiesByType,
    postCookies,
    putCookies,
    deleteCookies
}
