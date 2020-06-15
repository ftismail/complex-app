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

exports.viewSinglePost = async (req,res)=>{
    try {
        let post = new Post(req.body,req.session.user._id,req.params.id)
        let id = await post.findSingleById()
        res.render('single-post-view',{post:id})
    } catch  {
            res.render('404')
    }
}
