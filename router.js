const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const postContoller = require('./controllers/postController')
///user routers///
router.get('/',userController.home)
router.post('/register',userController.register)
router.post('/login',userController.logIn)
router.post('/logout',userController.logout)
///profile posts///
router.get('/profile/:username',userController.mustBeLogedIn,userController.ifUserExists,userController.profilePostScreen)
///post routers///
router.get('/create-post',userController.mustBeLogedIn,postContoller.createPostHome)
router.post('/create-post',userController.mustBeLogedIn,postContoller.createPost)
router.get('/post/:id',userController.mustBeLogedIn,postContoller.viewSinglePost)
router.get('/post/:id/edit',userController.mustBeLogedIn,postContoller.viewEditPost)
router.post('/post/:id/edit',userController.mustBeLogedIn,postContoller.edit)
router.post('/post/:id/delet',userController.mustBeLogedIn,postContoller.deletPost)
///post search///
router.post('/search',userController.mustBeLogedIn,postContoller.search)
module.exports = router