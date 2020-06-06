const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
router.get('/',userController.home)
router.post('/register',userController.register)
router.post('/login',userController.logIn)
router.post('/logout',userController.logout)
module.exports = router