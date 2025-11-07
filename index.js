console.clear()
console.log(`Iniciando The Cookie Jar`)

const PORT = 3000
const express = require('express')
const cors = require('cors')

const { getCookies, postCookies, putCookies, deleteCookies, getCookiesByType } = require('./controllers')
const { middlewareAuth, middlewareType, middleware404, middleware500 } = require('./middlewares')

const app = express()

    app.use( cors() )
    app.use( express.json() )
    app.use( express.urlencoded({ extended : false }) )

    app.use( middlewareAuth )

    app.get( `/cookies` , getCookies )
    app.get( `/cookies/type/:type` , middlewareType , getCookiesByType )

    app.post( `/cookies` , postCookies )
    app.put( `/cookies/_id/:_id` , putCookies )
    app.delete( `/cookies/_id/:_id` , deleteCookies )

    app.use( middleware404 )
    app.use( middleware500 )
    


app.listen( PORT , ()=> console.log(`Iniciando API en el puesrto ${PORT}`)) 