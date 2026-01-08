const middleware500 = ( error , req , res , next ) => {
    let status = error.status || 500
    res.status(status).json({ message: error.message, data: null })
}

module.exports = { middleware500 }
