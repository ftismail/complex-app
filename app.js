const express = require('express')
const app = express()
const port = 3000
app.use(express.static('public'))
app.set('views','view')
app.set('view engine','ejs')
app.get('/', (req, res) => {
    res.render('home-gust')
})
app.listen(port, () => console.log(`Example app listening on port port!`))