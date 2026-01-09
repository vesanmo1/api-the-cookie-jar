/*-----------------------------------------------------------------------------*\
 * Auth Controller (auth.controllers.js)
 *
 * Controlador de autenticación.
 * Gestiona el login validando las credenciales contra la base de datos.
 *
 * route {POST}   /auth                  Comprueba user_name y password en MongoDB.
 *
 * Comportamiento:
 * - Lee user_name y password desde req.body.
 * - Busca un usuario que coincida exactamente con ambos campos.
 * - Si no existe coincidencia, lanza error 401 (Credenciales incorrectas).
 * - Si existe, devuelve el documento del usuario encontrado.
\*-----------------------------------------------------------------------------*/

const { User } = require("./auth.schemas")

const loginUser = async (req, res, next) => {

    try {

        const { user_name, password } = req.body

        const search = await User.findOne({ user_name, password })

        if (!search) {
            const error = new Error("Credenciales incorrectas")
            error.status = 401
            throw error
        }

        res 
            .status(200)
            .json({ message: "Encontrando User", data: search })
            
    } catch (error) {
    next(error)
    }
}

module.exports = { loginUser }