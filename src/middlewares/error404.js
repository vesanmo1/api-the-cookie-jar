const middleware404 = ( req , res , next ) => {
    const error = new Error()
    error.message = `El endpoint al que llamas no existe`
    error.status  = 404 
    next(error)
}

module.exports = { middleware404 }