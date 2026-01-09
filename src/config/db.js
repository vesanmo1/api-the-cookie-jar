/*-----------------------------------------------------------------------------*\
 * Conexión a MongoDB (config/db.js)
 *
 * Este módulo gestiona la conexión de la API a MongoDB mediante Mongoose.
 *
 * Comportamiento:
 * - Lee la variable de entorno MONGO_URL desde process.env.
 * - Ejecuta mongoose.connect(MONGO_URL).
 * - Muestra por consola si la conexión es correcta o si ocurre un error.
 *
 * Requisito:
 * - Definir MONGO_URL en el archivo .env con la cadena de conexión de MongoDB.
\*-----------------------------------------------------------------------------*/

const mongoose = require("mongoose")

const connect = async () => {
  const { MONGO_URL } = process.env

  await mongoose
    .connect(MONGO_URL)
    .then(() => console.log("🌿 Conectado a MongoDB"))
    .catch((error) => console.log(error.message))
}

module.exports = { connect }