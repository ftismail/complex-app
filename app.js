const express = require('express')
const router = require('./router');
const app = express()
app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))
app.set('views','view')
app.set('view engine','ejs')
app.use('/',router)
module.exports = app