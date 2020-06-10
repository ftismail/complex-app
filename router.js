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
router.post('/create-post',userController.mustBeLogedIn,postContoller.createPost)
<<<<<<< HEAD
router.get('/post/:id',userController.mustBeLogedIn,postContoller.viewSingle)
=======
>>>>>>> 14ab38b614ac5d83e445a8c4a2b743aaf0173870
module.exports = router