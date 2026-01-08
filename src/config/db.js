// ============================================================
// CONNECT DB
// ------------------------------------------------------------
// Conecta a MongoDB usando la variable de entorno MONGO_URL
// ============================================================

const mongoose = require("mongoose")

const connect = async () => {
  const { MONGO_URL } = process.env

  await mongoose
    .connect(MONGO_URL)
    .then(() => console.log("🌿 Conectado a MongoDB"))
    .catch((error) => console.log(error.message))
}

module.exports = { connect }