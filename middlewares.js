/*---------------------------------------------------------------------*\
 * Middlewares de la API de Cookies (middlewares.js)
 *
 * Estos middlewares manejan la autenticación, la validación de parámetros
 * y los errores de la API.
 *
 * @middleware {middlewareAuth}      Comprueba la cabecera secret-api-key para autorizar la petición
 * @middleware {middlewareType}      Valida el parámetro :type (vegana | sin-gluten)
 * @middleware {middlewareObjectId}  Valida el parámetro :_id como ObjectId de MongoDB
 * @middleware {middleware404}       Gestiona las rutas no encontradas (404)
 * @middleware {middleware500}       Gestiona los errores del servidor (500)
\*---------------------------------------------------------------------*/

const {SECRET_API_KEY} = process.env

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
    middlewareObjectId,
    middleware404,
    middleware500
}