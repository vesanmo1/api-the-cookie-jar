/*-----------------------------------------------------------------------------*\
 * Middleware 500 (middleware500.js)
 *
 * Middleware global de manejo de errores del servidor.
 * Centraliza la respuesta cuando se lanza un error en la aplicación.
 *
 * Comportamiento:
 * - Recibe un objeto Error (error) desde next(error).
 * - Usa error.status si existe; en caso contrario responde con 500.
 * - Devuelve una respuesta JSON con:
 *   - message: mensaje del error
 *   - data: null
\*-----------------------------------------------------------------------------*/

const middleware500 = ( error , req , res , next ) => {
    let status = error.status || 500
    res.status(status).json({ message: error.message, data: null })
}

module.exports = { middleware500 }
