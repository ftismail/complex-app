const mongodb = require('mongodb')
const dotenv = require('dotenv')
dotenv.config()
mongodb.connect(process.env.CONNECTSTRING,{useNewUrlParser:true,useUnifiedTopology:true},function(err,client){
    module.exports = client.db()
    const app = require('./app') 
    app.listen(process.env.PORT, () => console.log(`Example app listening on port port!`))
})