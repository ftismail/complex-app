const postCollection = require('../db').db().collection('posts')
class Post {
    constructor(data,errors){
        this.data = data,
        this.errors = []
    }
    cleanUp(){
        if( typeof(this.data.title) !== 'string'){this.data.title = ''}
        if( typeof(this.data.body) !== 'string'){this.data.body = ''}
        this.data = {
            title : this.data.title.trim(),
            body : this.data.body.trim(),
            createDate : new Date()
        }
    }
    validation(){
        if(this.data.title = ''){this.errors.push('you need to put a title')}
        if(this.data.body = ''){this.errors.push('you need to put a bofy')}
    }
    create(){
        return new Promise ( async (resolve,reject)=>{
            this.cleanUp()
            this.validation()
            if(!this.errors.length){
                await postCollection.insertOne(this.data)
                resolve()
            }
            else{
                reject(this.errors)
            }
        })
    }
}
module.exports = Post