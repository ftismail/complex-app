const Post = require('../models/Post')
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