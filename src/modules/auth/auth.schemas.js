/*-----------------------------------------------------------------------------*\
 * Modelo de Usuario
 *
 * Este modelo define la estructura y comportamiento de los registros
 * de usuarios en MongoDB mediante Mongoose.
 *
 * property {string}   user_name       - Nombre de usuario (obligatorio).
 *                                      - Debe ser único (unique).
 *                                      - Se recorta (trim).
 *
 * property {string}   password        - Contraseña del usuario (obligatoria).
 *                                      - Se almacena como string (habitualmente hash en la capa de servicio/controller).
 *
 * Configuración del esquema:
 * - collection: "users" (nombre fijo de la colección).
 * - versionKey: false (no guarda __v).
 * - collation: español (locale "es") con strength 1.
\*-----------------------------------------------------------------------------*/

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema ( 
    {
        user_name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

    },

    {
        collection : 'users' ,
        versionKey : false , 
        collation : {
            locale : 'es',
            strength : 1
        }
    }
)

const User = mongoose.model ( 'User' , userSchema )


module.exports = {
    User
}