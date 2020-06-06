const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const router = require('./router')
const app = express()
let sessionOptions = session({
    secret:'it is a securt',
    store:new MongoStore({client:require('./db')}),
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24,httpOnly:true}
})
app.use(sessionOptions)
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(express.static('public'))
app.set('views','view')
app.set('view engine','ejs')
app.use('/',router)
module.exports = app