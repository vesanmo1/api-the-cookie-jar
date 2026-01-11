/*-----------------------------------------------------------------------------*\
 * Auth Middlewares
 *
 * Middlewares de validación para el endpoint de autenticación.
 * Comprueba que las credenciales en req.body sean correctas antes de llegar al
 * controlador.
 *
 * middleware {function} middlewareAuth       Valida user_name y password del body.
 *
 * Comportamiento:
 * - Lee user_name y password desde req.body.
 * - Si falta alguno, lanza error 400 (Faltan credenciales).
 * - Si alguno no es string, lanza error 400 (Deben ser texto).
 * - Si alguno tiene menos de 4 caracteres tras trim(), lanza error 400
 *   (Credenciales inválidas).
 * - Valida user_name con regex: solo permite letras, números, punto, guion y
 *   guion bajo, con longitud entre 4 y 30 caracteres.
 * - Si pasa todas las validaciones, ejecuta next() y continúa con el controller.
\*-----------------------------------------------------------------------------*/

const middlewareAuth = (req, res, next) => {

    const { user_name, password } = req.body

    // 1) Existen
    if (user_name === undefined || password === undefined) {

        const error = new Error("Faltan credenciales: user_name y/o password")
        error.status = 400
        return next(error)
    }

    // 2) Son strings
    if (typeof user_name !== "string" || typeof password !== "string") {

        const error = new Error("Credenciales inválidas: deben ser texto")
        error.status = 400
        return next(error)
    }

    // 3) No están vacías
    if (user_name.trim().length < 4 || password.trim().length < 4) {

        const error = new Error("Credenciales inválidas: debe contener al menos 4 caracteres")
        error.status = 400
        return next(error)
    }

    // Expresión regular con CHATGPT
    // Permite letras, números, guion bajo, guion y punto. 3 a 30 chars.
    const userNameRegex = /^[a-zA-Z0-9._-]{4,30}$/

    if (!userNameRegex.test(user_name.trim())) {
      const error = new Error("El campo user_name no es válido")
      error.status = 400
      return next(error)
    }

  next()
}

module.exports = { 
    middlewareAuth 
}