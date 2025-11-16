/*-----------------------------------------------------------------------------*\
 * Modelo de Cookie
 
 * Este modelo define la estructura y comportamiento de los registros
 * de cookies en la base de datos.
 
 * property {string}   cookie_name  - Nombre de la cookie.
 * property {string}   description  - Descripción de la cookie.
 * property {string[]} type         - Tipo de cookie (vegana, sin-gluten).
 * property {string}   img_url      - URL de la imagen de la cookie.
\*-----------------------------------------------------------------------------*/

const mongoose = require('mongoose')

const cookieSchema = new mongoose.Schema ( 
    {
        cookie_name: {
            type: String,
            required: true,
            trim: true,
            maxlength: [25, 'El nombre no puede superar los 25 caracteres']
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: [400, 'La descripción no puede superar los 400 caracteres']
        },

        type: {
            type: [String],                            // array de strings
            enum: ['vegana', 'sin-gluten'],            // valores permitidos
            default: [],                               // si no se envía nada → []
            required: false                            // campo opcional
        },

        img_url: {
            type: String,
            required: true,
            trim: true,
            match: [/^https?:\/\/.+/i, 'URL de imagen inválida'] ,
        },        
    },

    {
        collection : 'cookies' ,
        versionKey : false , 
        collation : {
            locale : 'es',
            strength : 1
        }
    }
)

const Cookie = mongoose.model ( 'Cookie' , cookieSchema )


module.exports = {
    Cookie
}