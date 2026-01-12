/*-----------------------------------------------------------------------------*\
 * The Cookie Jar / Express API (server.js)
 *
 * Punto de entrada de la API.
 * Inicializa el entorno, conecta con MongoDB y levanta el servidor HTTP.
 *
 * Flujo:
 * - Limpia la consola y muestra un mensaje de arranque.
 * - Carga variables de entorno desde .env.
 * - Obtiene el puerto (PORT) desde process.env.
 * - Importa la app Express ya configurada (middlewares, rutas y manejo de errores).
 * - Conecta a MongoDB.
 * - Arranca el servidor escuchando en PORT.
 *
 * Requisito:
 * - Definir PORT en el archivo .env.
\*-----------------------------------------------------------------------------*/

// Limpia la consola cada vez que se inicia la aplicación
console.clear()
console.log(`Iniciando The Cookie Jar`)

// Carga las variables de entorno desde el archivo .env
require("dotenv").config()

// Desestructuramos las variables de entorno necesarias
const { PORT } = process.env

// Importamos la app ya configurada (middlewares + rutas + 404/500)
const { app } = require("./app")

// Importamos la conexión a MongoDB desde config/db.js
const { connect } = require("./config/db")

// Conectamos a MongoDB al arrancar la API
connect()

// Arranca el servidor HTTP en el puerto indicado en las variables de entorno
app.listen(PORT, () => {
  console.log(`Iniciando API en el puerto ${PORT}`)
})