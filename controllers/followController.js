const Follow = require('../models/Follow')

exports.addFollow = (req,res)=>{
    let follow = new Follow(req.params.username,req.visiterId)
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