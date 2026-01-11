/*-------------------------------------------------------------------------------------------------------*\
 * Auth Router 
 *
 * Este router define las rutas relacionadas con autenticación.
 * Valida credenciales recibidas por body y delega la lógica al controller.
 *
 * route {POST}   /          Valida user_name y password (middlewareAuth) y ejecuta loginUser.
\*-------------------------------------------------------------------------------------------------------*/

const express = require("express")

const { loginUser } = require("./auth.controllers")
const { middlewareAuth } = require("./auth.middlewares")

const authRouter = express.Router()

authRouter.route("/")
    .post(middlewareAuth, loginUser)

module.exports = { 
    authRouter 
}