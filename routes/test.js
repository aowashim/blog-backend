const express = require('express')
const router = express.Router()

const tmw = require('../middleware/test')

router.get('/', tmw, (req, res) => {
  res.send('Hello....')
})

module.exports = router
