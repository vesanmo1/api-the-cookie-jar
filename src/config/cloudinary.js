/*---------------------------------------------------------------*\
 * The Cookie Jar / Cloudinary config
 *
 * Configuración del servicio Cloudinary para la gestión de imágenes
 * en la nube. Se utiliza junto con Multer (memoryStorage) para subir
 * archivos desde la API sin almacenarlos en disco.
 *
 * @service     {Cloudinary}
 * @upload      {images}
 * @storage     {cloud}
 * @env         {CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET}
\*---------------------------------------------------------------*/

// HECHO CON CHATGPT
// Cloudinary es un servicio de almacenamiento y gestión de archivos multimedia (imágenes, vídeos, GIFs) en la nube.

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

module.exports = cloudinary;