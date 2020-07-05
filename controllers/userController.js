const User = require('../models/User')
const Post = require('../models/Post')
const Follow = require('../models/Follow')
const { render } = require('../app')

exports.sharedProfileData = async (req,res,next)=>{
    let isFollowing = false
    let follow = new Follow()
    if (req.session.user) {
        isFollowing = await follow.isVisitorFollowing(req.profileUser._id,req.session.user._id)
    }
    req.isFollowing = isFollowing
    let postCountPromise =  new Post().countPostsById(req.profileUser._id)
    let followersCountPromise = new Follow().countFollowersById(req.profileUser._id)
    let followingCountPromise = new Follow().countFollowingById(req.profileUser._id)
    let [postsCount,followersCount,followingCount] =  await Promise.all([postCountPromise,followersCountPromise,followingCountPromise])
    req.postsCount = postsCount
    req.followersCount = followersCount
    req.followingCount = followingCount
    next()
}

exports.mustBeLogedIn = (req,res,next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash('errors','you must be logedin to see this content')
        req.session.save(function(){
            res.redirect('/')
        })
    }
}
exports.logIn = (req,res)=>{
    let user = new User(req.body)
    user.login()
    .then(resultas=> {
        req.session.user = {username:user.data.username,_id:user.data._id,avatar:user.avatar}
        req.session.save(function(){
            res.redirect('/')
        })
    } )
    .catch(err=>{
        req.flash('errors',err)
        req.session.save(function() {
            res.redirect("/")
        })
        
    })
        
}
exports.logout = (req,res) => {
    req.session.destroy(function(){
        res.redirect('/')
    })
}
exports.register = function(req,res){
    let user = new User(req.body)
    user.register()
    .then(()=>{
        req.session.user = {username:user.data.username,_id:user.data._id,avatar:user.avatar}
        req.session.save(function(){
            res.redirect('/')
        })
    })
    .catch((resultas)=>{
        resultas.forEach(function(e){
            req.flash('registerErrors',e)
        })
        req.session.save(function(){
            res.redirect('/')
        })
    })
}
exports.home = async function (req,res){
    if (req.session.user) {
        ////fetch feed of posts///
        let posts = await new Post().getFeed(req.session.user._id)
        res.render('home-dashbord',{posts:posts})
    } else {
        res.render('home-gust',{registerErrors:req.flash('registerErrors')})
    }
}

exports.ifUserExists = function (req,res,next){
    let user = new User(req.body)
    user.findByUsername(req.params.username)
    .then((userDocument)=>{
        req.profileUser = userDocument
        next()
    })
    .catch(()=>{
        res.render('404')
    })
}
exports.profilePostScreen = async function (req,res,next){
    try {
        let xx = new Post()
        let posts = await xx.findByAuthorId(req.profileUser._id) 
        let pos
        res.render('profile-posts',{
            correntPage:'posts',
            posts:posts,
            profileId:req.profileUser._id,
            profileName:req.profileUser.username,
            profileAvatar:req.profileUser.avatar,
            isFollowing:req.isFollowing,
            counts:{postsCount:req.postsCount,followersCount:req.followersCount,followingCount:req.followingCount}
         })
    } catch (error) {
        res.render('404')
    }
}
exports.profileFollowrsScreen = async(req,res)=>{
    let follower = new Follow(req.params.username,req.session.user._id)
    try {
        let followers = await follower.getFollowrsById(req.profileUser._id)
        res.render('profile-followers',{
            correntPage:'followers',
            followers:followers,
            profileId:req.profileUser._id,
            profileName:req.profileUser.username,
            profileAvatar:req.profileUser.avatar,
            isFollowing:req.isFollowing,
            counts:{postsCount:req.postsCount,followersCount:req.followersCount,followingCount:req.followingCount}
        })
    } catch (error) {
        res.render('404')
        console.log(error)
    }
}

exports.profileFollowingScreen = async (req,res)=>{
    let follower = new Follow(req.params.username,req.session.user._id)
    try {
        let following = await follower.getFollowingById(req.profileUser._id)
        res.render('profile-following',{
            correntPage:'following',
            following:following,
            profileId:req.profileUser._id,
            profileName:req.profileUser.username,
            profileAvatar:req.profileUser.avatar,
            isFollowing:req.isFollowing,
            counts:{postsCount:req.postsCount,followersCount:req.followersCount,followingCount:req.followingCount}
        })
    } catch (error) {
        res.render('404')
        console.log(error)
    }
}