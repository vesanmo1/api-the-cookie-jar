/*-----------------------------------------------------------------------------*\
 * Modelo de Cookie
 
 * Este modelo define la estructura y comportamiento de los registros
 * de cookies en la base de datos.
 
 * property {string}   cookie_name  - Nombre de la cookie.
 * property {string}   description  - Descripción de la cookie.
 * property {string[]} types        - Tipos de cookie ("Vegana", "Sin gluten").
 * property {string}   image_png    - Ruta/URL de la imagen PNG.
 * property {string}   image_webp   - Ruta/URL de la imagen WEBP.
 * property {boolean}  visible      - Si la cookie se muestra o no.
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

        types: {
            type: [String],                            // array de strings
            enum: ['Vegana', 'Sin gluten'],            // valores permitidos
            default: [],                               // si no se envía nada → []
            required: false                            // campo opcional
        },

        image_png: {
            type: String,
            required: true,
            trim: true,
        },   
        
        image_webp: {
            type: String,
            required: false,
            trim: true,
            default: ""
        },

        visible: {
            type: Boolean,
            required: true,
            default: true,
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