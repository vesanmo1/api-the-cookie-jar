/*---------------------------------------------------------------*\
 * The Cookie Jar / Cloudinary config
 *
 * Configuración del cliente de Cloudinary (SDK v2) para la gestión
 * de imágenes en la nube.
 *
 * Este módulo solo inicializa Cloudinary con variables de entorno.
 * La subida de archivos (por ejemplo, buffers provenientes de Multer
 * con memoryStorage) se realiza en los controllers/middlewares.
 *
 * @service     {Cloudinary}
 * @env         {CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET}
\*---------------------------------------------------------------*/

// HECHO CON CHATGPT
// Cloudinary es un servicio de almacenamiento y gestión de archivos multimedia (imágenes, vídeos, GIFs) en la nube.

const cloudinary = require("cloudinary").v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

module.exports = cloudinary