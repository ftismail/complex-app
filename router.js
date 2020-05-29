const express = require('express')
const router = express.Router()
router.get('/', (req, res) => {
    res.render('home-gust')
})
module.exports = router