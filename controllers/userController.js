const User = require('../models/User')
exports.mustBeLogedIn = (req,res,next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash('error','you must be logedin to see this content')
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
        req.flash('error',err)
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
exports.home = function (req,res){
    if (req.session.user) {
        res.render('home-dashbord')
    } else {
        res.render('home-gust',{errors:req.flash('error'),registerErrors:req.flash('registerErrors')})
    }
}