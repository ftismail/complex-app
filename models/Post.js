const postCollection = require('../db').db().collection('posts')
const ObjectId = require('mongodb').ObjectID
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
            aurthor:ObjectId(this.userId)
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
}
module.exports = Post