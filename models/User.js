    const bcrypt = require('bcryptjs');
    const validator = require('validator');
    const userCollection = require('../db').db().collection('user')
    const md5 = require('md5');
    class User{
    constructor(data,getAvatar){
        this.data = data
        this.error = []
        if(getAvatar == undefined){getAvatar=false}
        if(getAvatar){this.getavatar()}
    }
    cleanUp(){
        if(typeof(this.data.username) != 'string' ){this.data.username=""}
        if(typeof(this.data.email) != 'string' ){this.data.email=""}
        if(typeof(this.data.password) != 'string' ){this.data.username=""}
        this.data={
            username:this.data.username.trim().toLowerCase(),
            email: this.data.email.trim().toLowerCase(),
            password:this.data.password
        }
    }
    validation(){ 
        return new Promise(async (resolve,reject)=>{
        if(this.data.username == "") this.error.push('you must put a valid username')
        if(this.data.username !== "" && !validator.isAlphanumeric(this.data.username)){this.error('user name can only contain numbers and lettres')}
        if(!validator.isEmail(this.data.email)) this.error.push('you must put a valid email')
        if(this.data.password == "") this.error.push('you must put a valid password')
        if(this.data.password.length > 0 && this.data.password.length < 6 ) this.error.push('your password should have at least 6 charecters or numbers')
        if(this.data.password.length > 25 ) this.error.push('your password can not exceed 25 charecters or numbers')
        if(this.data.username.length > 0 && this.data.username.length < 3 ) this.error.push('your username should be at least 3 charecters or numbers')
        if(this.data.username.length > 20 ) this.error.push('your username can not exceed 20 charecters or numbers')
        ////check if the userName has already exist
        if(this.data.username.length > 3 && this.data.username.length < 20 && validator.isAlphanumeric(this.data.username)) {
            let userNameExist = userCollection.findOne({username:this.data.username})
            if(this.userNameExist){this.error.push('this user name is already token')}
        }
        ////check if the userName has already exist
        if(this.data.username.length > 3 && this.data.username.length < 20 && validator.isAlphanumeric(this.data.username)) {
            let userNameExist = await userCollection.findOne({username:this.data.username})
            if(userNameExist){this.error.push('this user name is already token')}
        }
        ////check if the userName has already exist
        if(this.data.username.length > 3 && this.data.username.length < 20 && validator.isAlphanumeric(this.data.username)) {
            let emailExist = await userCollection.findOne({email:this.data.email})
            if(emailExist){this.error.push('this email is already token')}}
            resolve()
        })
    }
    register(){
        return new Promise( async (resolve,reject)=>{
            this.cleanUp()
            await this.validation()
            if (!this.error.length ) {
                let salt = bcrypt.genSaltSync(10)
                this.data.password = bcrypt.hashSync(this.data.password,salt)
                await userCollection.insertOne(this.data)
                this.getavatar()
                resolve()
            }
            else{
                reject(this.error)
            }
        })
    }
    login() { 
            return new Promise ((resolve,reject)=>{
                this.cleanUp()
                userCollection.findOne({username:this.data.username},(err,acceptedUserName)=>{
                    if (acceptedUserName && bcrypt.compareSync(this.data.password,acceptedUserName.password)) {
                        this.data = acceptedUserName
                        this.getavatar()
                        resolve('congats')
                    }
                    else{
                        reject('invalid username or password')
                    }
                })
            })
    }
    getavatar(){
        this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`
    }
    
findByUsername = (username)=>{
    return new Promise ( async (resolve,reject)=>{
        if (typeof(username) != 'string') {
            reject()
            return
        }
        let userNameExist = await userCollection.findOne({username:username})
        if (userNameExist) {
            let userDoument = new User(userNameExist,true)
            userDoument = {
                _id:userDoument.data._id,
                username:userDoument.data.username,
                avatar:userDoument.avatar
            }
            resolve(userDoument)
        } else {
            reject()
        }
    })
}
}
module.exports = User

