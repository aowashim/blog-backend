const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const auth = require('../middleware/auth')

require('dotenv').config()

// get user info (own)
router.get('/', auth, (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    `select userName, uid, name, city, about, dp from userinfo where userName=?`,
    [`${req.userName}`],
    async (err, results) => {
      if (err) {
        res.status(500).json({ msg: err.message })
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

// get user info (others)
router.get('/view', (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    `select userName, uid, name, city, about, dp from userinfo where userName=?`,
    [`${req.query.id}`],
    async (err, results) => {
      if (err) return res.status(500).json({ msg: err.message })

      if (!results.length)
        return res.status(400).json({ msg: 'No records found.' })

      // checking follower
      const data = { ...results[0], fname: false }
      myConnection.query(
        `select fname from following where uname=? and fname=?`,
        [`${req.query.un}`, `${req.query.id}`],
        async (err, results) => {
          if (err) return res.status(500).json({ msg: err.message })

          data.fname = results[0]?.fname ? true : false
          res.status(200).json(data)
        }
      )
    }
  )
})

// Edit profile (private)
router.put('/', auth, (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  const data = req.body

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    `update userinfo set name=?, city=?, about=?, dp=? where userName=?`,
    [
      `${data.name}`,
      `${data.city}`,
      `${data.about}`,
      `${data.dp}`,
      `${req.userName}`,
    ],
    async (err, results) => {
      if (err) {
        res.status(500).json({ msg: err.message })
      } else {
        res.status(200).json({ name: data.name, uname: req.userName })
      }
    }
  )

  myConnection.end()
})

module.exports = router
