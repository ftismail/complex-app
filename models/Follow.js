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
            this.followedId = followedAccount._id
        } else {
            this.errors.push('you cant follow this user')
        }
        let ifFollowerAlreadyExist = await followsCollection.findOne({followedId:this.followedId,authorId:new ObjectId(this.authorId)})
        if (action == 'create') {
            if (ifFollowerAlreadyExist || this.followedId == this.authorId ) {
                this.errors.push('you have already followed this user')
            }
        }
        if (action == 'remove') {
            if (!ifFollowerAlreadyExist || this.followedId == this.authorId) {
                this.errors.push('you are not following this user')
            }
        }
    }
    create(){
        return new Promise( async (resolve,reject)=>{
            this.cleanUp()
            await this.validation('create')
            if (!this.errors.length) {
                await followsCollection.insertOne({followedId:this.followedId,authorId:new ObjectId(this.authorId)})
                resolve()
            } else {
                reject(this.errors)
            }
        })
    }
    async isVisitorFollowing(followedId,visitorId){
    let followDoc = await followsCollection.findOne({followedId:followedId,authorId:new ObjectId(visitorId)})
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
                await followsCollection.deleteOne({followedId:this.followedId,authorId:new ObjectId(this.authorId)})
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
                    {$match:{followedId :id }},
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

    getFollowingById(id){
        return new Promise( async (resolve,reject)=>{
            try {
                let following = await followsCollection.aggregate([
                    {$match:{authorId :id }},
                    {$lookup:{from:'user',localField:'followedId',foreignField:'_id',as:'authorDocument'}},
                    {$project:{
                        username:{$arrayElemAt:["$authorDocument.username",0]},
                        email:{$arrayElemAt:["$authorDocument.email",0]}
                    }},
                ]).toArray()
                following = following.map(follow=>{
                    return {username:follow.username,avatar:new User(follow,true).avatar}
                })
                resolve(following)
            } catch (error) {
                reject(error)
            }
            
        })
    }

    countFollowersById(userId){
        return new Promise( async (resolve,reject)=>{
            let followers = await followsCollection.countDocuments({followedId:userId})
            resolve(followers)
        })
    }

    countFollowingById(userId){
        return new Promise( async (resolve,reject)=>{
            let following = await followsCollection.countDocuments({authorId:userId})
            resolve(following)
        })
    }


}
 


module.exports = Folow;