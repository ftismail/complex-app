const Follow = require('../models/Follow')

exports.addFollow = (req,res)=>{
    let follow = new Follow(req.params.username,req.session.user._id)
    follow.create()
    .then(()=>{
        req.flash('success',`you have successufly followed${req.params.username}`)
        req.session.save(()=>res.redirect(`/profile/${req.params.username}`))
    })
    .catch((errors)=>{
        errors.forEach(element => {
            req.flash('errors',element)
        });
        req.session.save(()=>res.redirect(`/`))
    })
}

exports.removeFollow = (req,res)=>{
    let follow = new Follow(req.params.username,req.session.user._id)
    follow.remove()
    .then(()=>{
        req.flash('success',`you have successufly unfollowed${req.params.username}`)
        req.session.save(()=>res.redirect(`/profile/${req.params.username}`))
    })
    .catch((errors)=>{
        errors.forEach(element => {
            req.flash('errors',element)
        });
        req.session.save(()=>res.redirect(`/`))
    })
}