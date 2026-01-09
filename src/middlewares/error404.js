/*-----------------------------------------------------------------------------*\
 * Middleware 404 (middleware404.js)
 *
 * Middleware global para rutas no encontradas.
 * Se ejecuta cuando ninguna ruta anterior coincide con la petición.
 *
 * Comportamiento:
 * - Crea un Error con mensaje informativo.
 * - Asigna status 404.
 * - Llama a next(error) para que lo gestione el middleware500.
\*-----------------------------------------------------------------------------*/

const middleware404 = ( req , res , next ) => {
    const error = new Error()
    error.message = `El endpoint al que llamas no existe`
    error.status  = 404 
    next(error)
}

module.exports = { middleware404 }