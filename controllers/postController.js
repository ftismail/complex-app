const Post = require('../models/Post')

exports.createPostHome = (req,res) =>{
    res.render('create-post')
}

exports.createPost = (req,res) =>{
    let post = new Post(req.body,req.session.user._id)
    post.create().then(()=>{
        req.session.save(function(){
            res.redirect('/')
        })
    })
    .catch((error)=>{
        res.send(error)
    })
}

exports.viewSingle = (req,res)=>{
    res.render('single-post-view')
}
