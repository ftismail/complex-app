const postCollection = require('../db').db().collection('posts')
const ObjectId = require('mongodb').ObjectID
const User = require ('./User')
class Post{
    constructor(data,userId,id){
        this.data = data
        this.error = []
        this.userId = userId
        this.id = id
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
    findSingleById(){
        return new Promise(async (resolve,reject)=>{
            if ( typeof(this.id) != 'string' || !ObjectId.isValid(this.id) ) {
                reject()
                return
            }
            let posts = await postCollection.aggregate([
                {$match:{_id: new ObjectId(this.id)}},
                {$lookup:{from:'user',localField:'author',foreignField:'_id',as:'authorDocument'}},
                {$project:{
                    title:1,
                    body:1,
                    createDate:1,
                    author:{$arrayElemAt:["$authorDocument",0]}
                }}
            ]).toArray()
            posts = posts.map(element=>{
                element.author = {
                    username:element.author.username,
                    avatar: new User (element.author,true).avatar
                }
                return element
            })
            if (posts.length) {
                console.log(posts)
                resolve(posts[0])
            } else {
                reject()
            }
        })
    }
}
module.exports = Post