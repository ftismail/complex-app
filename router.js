const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const postContoller = require('./controllers/postController')
const followContoller = require('./controllers/followController')
///user routers///
router.get('/',userController.home)
router.post('/register',userController.register)
router.post('/login',userController.logIn)
router.post('/logout',userController.logout)
///profile posts///
router.get('/profile/:username',userController.ifUserExists,userController.sharedProfileData,userController.profilePostScreen)
router.get('/profile/:username/followers',userController.ifUserExists,userController.sharedProfileData,userController.profileFollowrsScreen)
router.get('/profile/:username/following',userController.ifUserExists,userController.sharedProfileData,userController.profileFollowingScreen)


///post routers///
router.get('/create-post',userController.mustBeLogedIn,postContoller.createPostHome)
router.post('/create-post',userController.mustBeLogedIn,postContoller.createPost)
router.get('/post/:id',userController.mustBeLogedIn,postContoller.viewSinglePost)
router.get('/post/:id/edit',userController.mustBeLogedIn,postContoller.viewEditPost)
router.post('/post/:id/edit',userController.mustBeLogedIn,postContoller.edit)
router.post('/post/:id/delet',userController.mustBeLogedIn,postContoller.deletPost)
///post search///
router.post('/search',userController.mustBeLogedIn,postContoller.search)
///Following///
router.post('/addfollower/:username',userController.mustBeLogedIn,followContoller.addFollow)
router.post('/removefollower/:username',userController.mustBeLogedIn,followContoller.removeFollow)
module.exports = router