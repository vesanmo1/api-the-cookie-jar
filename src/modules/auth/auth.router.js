/*-------------------------------------------------------------------------------------------------------*\
 * Auth Router
 *
 * Este router define las rutas relacionadas con autenticación.
 * Valida credenciales recibidas por body y delega la lógica al controller.
 *
 * route {POST}   /auth      Valida user_name y password (middlewares) y ejecuta login.
 *
 * Nota:
 * - Aunque el comentario original menciona "/login", en este archivo la ruta es "/" y se monta
 *   normalmente bajo "/auth" (app.use("/auth", authRouter)), por lo que el endpoint final es /auth.
\*-------------------------------------------------------------------------------------------------------*/

const express = require("express")

const { loginUser } = require("./auth.controllers")
const { middlewareUserName, middlewarePassword } = require("./auth.middlewares")

const router = express.Router()

router.route("/")
    .post(middlewareUserName, middlewarePassword, loginUser)

module.exports = {
    router
}