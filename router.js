const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const postContoller = require('./controllers/postController')
///user routers///
router.get('/',userController.home)
router.post('/register',userController.register)
router.post('/login',userController.logIn)
router.post('/logout',userController.logout)
///post routers///
router.get('/create-post',userController.mustBeLogedIn,postContoller.createPostHome)
module.exports = router