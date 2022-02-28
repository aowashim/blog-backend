const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const auth = require('../middleware/auth')

require('dotenv').config()

// get user info
router.get('/', auth, (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: 'Server error.' })
  })

  myConnection.query(
    `select userName, uid, name, city, about, dp from userinfo where userName=?`,
    [`${req.userName}`],
    async (err, results) => {
      if (err) {
        res.status(500).json({ msg: 'Server error.' })
      } else {
        if (results.length) {
          res.status(200).json(results[0])
        } else {
          res.status(400).json({ msg: 'No records found.' })
        }
      }
    }
  )

  myConnection.end()
})

module.exports = router
