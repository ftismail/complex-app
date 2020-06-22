const Post = require('../models/Post')
const { render } = require('../app')

exports.createPostHome = (req,res) =>{
    res.render('create-post')
}

exports.createPost = (req,res) =>{
    let post = new Post(req.body,req.session.user._id)
    post.create().then((newId)=>{
        req.flash('success','you have created a new post')
        req.session.save(function(){
            res.redirect(`/post/${newId}`)
        })
    })
    .catch((error)=>{
        error.forEach(error=>{
            req.flash('errors',error)
        })
        req.session.save(function(){
            res.redirect(`/create-post`)
        })
    })
}

exports.viewSinglePost = async (req,res)=>{
    try {
        let post = new Post()
        let id = await post.findSingleById(req.params.id,req.visitorId)
        res.render('single-post-view',{post:id})
    } catch  {
            res.render('404')
    }
}

exports.viewEditPost = async (req,res)=>{
    try {
        let post = new Post()
        let id = await post.findSingleById(req.params.id,req.visitorId)
        if (id.isTheOwner) {
            res.render("edit-post", {post: id})
          } else {
            req.flash("errors", "You do not have permission to perform that action.")
            req.session.save(() => res.redirect("/"))
            console.log('here')
          }
    } catch  {
            res.render('404')
    }
}

exports.edit = async (req,res)=>{
    let post = new Post(req.body)
    post.update(req.params.id)
    .then((resultats)=>{
        if (resultats == 'success') {
            req.flash('success','the post has been updated successufly')
            req.session.save(function(){  
             res.redirect(`/post/${req.params.id}`)
             
            })
        } else {
            post.error.forEach((e)=>{
                req.flash('erroes',e)
            })
            req.session.save(() => res.redirect(`/post/${req.params.id}`))
        }
    })
    .catch(()=>{
        res.render('404')
    })
}
exports.deletPost = (req,res)=>{
    post = new Post()
    post.delet(req.params.id,req.visitorId)
    .then(()=>{
        req.flash('success','post successufly deleted')
        req.session.save(() => res.redirect(`/profile/${req.session.user.username}`))
    })
    .catch(()=>{
        req.flash('errors','try again')
        req.session.save(() => res.redirect(`/`))
    })
}