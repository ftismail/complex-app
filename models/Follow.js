const { ObjectID } = require('mongodb')
const userCollection = require('../db').db().collection('user')
const followsCollection = require('../db').db().collection('follows')
class Folow {
    constructor(followedUserName,authorId) {
        this.followedUserName = followedUserName
        this.authorId = authorId 
        this.errors = []
    }
    cleanUp(){
        if (typeof(this.followedUserName != 'string')) {this.followedUserName == ''}
    }
     async validation(){
        let followedAccount = await userCollection.findOne({username:this.followedUserName})
        if (followedAccount) {
            this.follwedId = followedAccount._id
        } else {
            this.errors.push('you cant follow this user')
        }
    }
    create(){
        return new Promise( async (resolve,reject)=>{
            this.cleanUp()
            await this.validation()
            if (!this.errors.length) {
                await followsCollection.insertOne({follwedId:this.follwedId,authorId: new ObjectID(this.authorId)})
                resolve()
            } else {
                reject(this.errors)
            }
        })
    }
}
 
module.exports = Folow;