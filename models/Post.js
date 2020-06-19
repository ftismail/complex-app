const postCollection = require('../db').db().collection('posts')
const ObjectId = require('mongodb').ObjectID
const User = require ('./User')
class Post{
    constructor(data,userId){
        this.data = data
        this.error = []
        this.userId = userId
    }
    cleanUp(){
        if(typeof(this.data.title) != 'string') {this.data.title=''}
        if(typeof(this.data.body) != 'string') {this.data.body=''}
        this.data = {
            title:this.data.title.trim(),
            body:this.data.body.trim(),
            createDate:new Date(),
            author:ObjectId(this.userId)
        }
    }
    validation(){
        if(this.data.title == ""){this.error.push('you should put title post')}
        if(this.data.body == ""){this.error.push('you most procide post content')}
    }
    create(){
        return new Promise( async (resolve,reject)=>{
            this.cleanUp()
            this.validation()
            if (!this.error.length) {
                await postCollection.insertOne(this.data)
                resolve()
            } else {
                reject(this.error)
            }
        })
    }
    findSingleById(id,visitorId){
        return new Promise(async (resolve,reject)=>{
            if ( typeof(id) != 'string' || !ObjectId.isValid(id) ) {
                reject()
                return
            }
            let posts = await postCollection.aggregate([
                {$match:{_id: new ObjectId(id)}},
                {$lookup:{from:'user',localField:'author',foreignField:'_id',as:'authorDocument'}},
                {$project:{
                    title:1,
                    body:1,
                    createDate:1,
                    authorId:'$author',
                    author:{$arrayElemAt:["$authorDocument",0]}
                }}
            ]).toArray()
            posts = posts.map(element=>{
                element.isTheOwner = element.authorId.equals(visitorId)
                element.author = {
                    username:element.author.username,
                    avatar: new User (element.author,true).avatar
                }
                return element
            })
            if (posts.length) {
                resolve(posts[0])
            } else {
                reject()
            }
        })
    }


    findByAuthorId(authorId){
        return new Promise( async (resolve,reject)=>{
            let posts = await postCollection.aggregate([
                {$match:{author:authorId}},
                {$sort:{createDate:-1}}
            ]).toArray()
            if (posts.length) {
                resolve(posts)
            } else {
                reject()
            }
        })
    }
    update(postId){
        return new Promise(async(resolve,reject)=>{
            this.cleanUp()
            this.validation()
            if (!this.error.length) {
                 await postCollection.findOneAndUpdate({_id: new ObjectId(postId)},{$set:{title:this.data.title,body:this.data.body}},{new:true})
                resolve('success')
            } else {
                resolve('error')
            }
        })
    }
}
module.exports = Post