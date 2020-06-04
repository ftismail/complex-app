const User = require('../models/User')
exports.logIn = ()=>{

}
exports.logOut = ()=>{
    
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
    res.render('home-gust')
}