const { SECRET_API_KEY } = process.env

// -------------------- AUTH --------------------
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

module.exports = { middlewareAuth }