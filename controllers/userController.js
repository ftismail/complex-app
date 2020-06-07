const User = require('../models/User')
exports.logIn = (req,res)=>{
    let user = new User(req.body)
    user.login()
    .then(resultas=> {
        req.session.user = {username:user.data.username}
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
    if (user.error.length) {
        user.error.forEach(function(e){
            req.flash('registerErrors',e)
        })
        req.session.save(function(){
            res.redirect('/')
        })
    } else {
        req.session.user = {username:user.data.username}
        req.session.save(function(){
            res.redirect('/')
        })
    }
}
exports.home = function (req,res){
    if (req.session.user) {
        res.render('home-dashbord',{username: req.session.user.username})
    } else {
        res.render('home-gust',{errors:req.flash('error'),registerErrors:req.flash('registerErrors')})
    }
}