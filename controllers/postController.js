const Post = require('../models/Post')
<<<<<<< HEAD

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
=======
exports.createPostHome = (req,res) =>{
    res.render('create-post')
}
exports.createPost = (req,res) =>{
    let post = new Post(req.body)
    post.create()
    .then(()=>{
        res.send('it is done')
    })
    .catch(error => {
        res.send(error)
    })
}
>>>>>>> 14ab38b614ac5d83e445a8c4a2b743aaf0173870
