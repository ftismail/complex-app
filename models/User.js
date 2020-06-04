    const validator = require('validator');
    const userCollection = require('../db').collection('user')
    class User{
    constructor(data){
        this.data = data
        this.error = []
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
        if(this.data.username == "") this.error.push('you must put a valid username')
        if(this.data.username !== "" && !validator.isAlphanumeric(this.data.username)){this.error('user name can only contain numbers and lettres')}
        if(!validator.isEmail(this.data.email)) this.error.push('you must put a valid email')
        if(this.data.password == "") this.error.push('you must put a valid password')
        if(this.data.password.length > 0 && this.data.password.length < 6 ) this.error.push('your password should have at least 6 charecters or numbers')
        if(this.data.password.length > 25 ) this.error.push('your password can not exceed 25 charecters or numbers')
        if(this.data.username.length > 0 && this.data.username.length < 3 ) this.error.push('your username should be at least 3 charecters or numbers')
        if(this.data.username.length > 20 ) this.error.push('your username can not exceed 20 charecters or numbers')
    }
    register(){
        this.cleanUp()
        this.validation()
        if (!this.error.length ) {
            userCollection.insertOne(this.data)
        }
    }
}
module.exports = User