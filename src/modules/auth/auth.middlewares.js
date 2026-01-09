/*-----------------------------------------------------------------------------*\
 * Auth Middlewares
 *
 * Este archivo contiene validaciones de credenciales y un middleware de protección.
 *
 * middleware {function} middlewareUserName   - Valida el campo user_name del body.
 *                                            - Requiere que exista y sea string.
 *                                            - Permite caracteres: letras, números y _.-
 *
 * middleware {function} middlewarePassword   - Valida el campo password del body.
 *                                            - Requiere que exista y sea string.
 *                                            - Longitud permitida: entre 4 y 30 caracteres.
 *
 * middleware {function} middlewareAuth       - Middleware de autorización simple por cabecera.
 *                                            - Requiere header "x-login" con valor "true".
 *                                            - Si no, responde con error 401.
\*-----------------------------------------------------------------------------*/

const middlewareUserName = (req, res, next) => {

    const { user_name } = req.body

    if (!user_name || typeof user_name !== "string") {
        const error = new Error("El campo user_name es obligatorio")
        error.status = 400
        return next(error)
    }

    //USO DE CHATGPT para la expresión regular
    const userNameValido = /^[A-Za-z0-9_.-]+$/.test( user_name.trim() )
    console.log( userNameValido )

    if (userNameValido) {
        next()
    } else {
        const error = new Error("El campo user_name no es válido")
        error.status = 400
        next(error)
    }
}

const middlewarePassword = (req, res, next) => {
  const { password } = req.body

  if (!password || typeof password !== "string") {
    const error = new Error("El campo password es obligatorio")
    error.status = 400
    return next(error)
  }

  // Reglas: entre 4 y 30 caracteres
  const passwordValid = password.length >= 4 && password.length <= 30
  console.log(passwordValid)

  if (passwordValid) {
    next()
  } else {
    const error = new Error("El campo password no es válido")
    error.status = 400
    next(error)
  }
}

const middlewareAuth = (req, res, next) => {
    const login = req.headers["x-login"]

    if (login === "true") return next()

    const error = new Error("No autorizado")
    error.status = 401
    next(error)
}

module.exports = {
  middlewareUserName,
  middlewarePassword,
  middlewareAuth
}