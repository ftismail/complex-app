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
    .catch(err=>res.send(err))
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
        res.send(user.error)
    } else {
        res.send('thanjs you have been refistred without any problems')
    }
}
exports.home = function (req,res){
    if (req.session.user) {
        res.render('home-dashbord',{username: req.session.user.username})
    } else {
        res.render('home-gust')
    }
    
}