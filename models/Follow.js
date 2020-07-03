const ObjectId = require('mongodb').ObjectID
const userCollection = require('../db').db().collection('user')
const followsCollection = require('../db').db().collection('follows')
const User = require ('./User')
class Folow {
    constructor(followedUserName,authorId) {
        this.followedUserName = followedUserName
        this.authorId = authorId 
        this.errors = []
    }
    cleanUp(){
        if (typeof(this.followedUserName != 'string')) {this.followedUserName == ''}
    }
     async validation(action){
        let followedAccount = await userCollection.findOne({username:this.followedUserName})
        if (followedAccount) {
            this.follwedId = followedAccount._id
        } else {
            this.errors.push('you cant follow this user')
        }
        let ifFollowerAlreadyExist = await followsCollection.findOne({follwedId:this.follwedId,authorId:new ObjectId(this.authorId)})
        if (action == 'create') {
            if (ifFollowerAlreadyExist || this.follwedId == this.authorId ) {
                this.errors.push('you have already followed this user')
            }
        }
        if (action == 'remove') {
            if (!ifFollowerAlreadyExist || this.follwedId == this.authorId) {
                this.errors.push('you are not following this user')
            }
        }
    }
    create(){
        return new Promise( async (resolve,reject)=>{
            this.cleanUp()
            await this.validation('create')
            if (!this.errors.length) {
                await followsCollection.insertOne({follwedId:this.follwedId,authorId:new ObjectId(this.authorId)})
                resolve()
            } else {
                reject(this.errors)
            }
        })
    }
    async isVisitorFollowing(follwedId,visitorId){
    let followDoc = await followsCollection.findOne({follwedId:follwedId,authorId:new ObjectId(visitorId)})
    if (followDoc) {
        return true
    } else {
        return false
    }
}
    remove(){
        return new Promise( async (resolve,reject)=>{
            this.cleanUp()
            await this.validation('remove')
            if (!this.errors.length) {
                await followsCollection.deleteOne({follwedId:this.follwedId,authorId:new ObjectId(this.authorId)})
                resolve()
            } else {
                reject(this.errors)
            }
        })
    }

    getFollowrsById(id){
        return new Promise( async (resolve,reject)=>{
            try {
                let followers = await followsCollection.aggregate([
                    {$match:{follwedId :id }},
                    {$lookup:{from:'user',localField:'authorId',foreignField:'_id',as:'authorDocument'}},
                    {$project:{
                        username:{$arrayElemAt:["$authorDocument.username",0]},
                        email:{$arrayElemAt:["$authorDocument.email",0]}
                    }},
                ]).toArray()
                followers = followers.map(follow=>{
                    return {username:follow.username,avatar:new User(follow,true).avatar}
                })
                resolve(followers)
            } catch (error) {
                reject(error)
            }
            
        })
    }




}
 


module.exports = Folow;