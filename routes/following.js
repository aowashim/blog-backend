const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const auth = require('../middleware/auth')

require('dotenv').config()

// get all the following
router.get('/following', (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: 'Server error.' })
  })

  myConnection.query(
    `select userName, name, dp, f.id from following f inner join userinfo u on uname=? and
      fname=userName and f.id<? order by f.id desc limit 10`,
    [`${req.query.un}`, `${req.query.id}`],
    (err, results) => {
      if (err) {
        res.status(500).json({ msg: 'Server error.' })
      } else {
        if (results.length) {
          res.status(200).json(results)
        } else {
          res.status(400).json({ msg: 'No followers.' })
        }
      }
    }
  )

  myConnection.end()
})

// get all the followers
router.get('/follower', (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: 'Server error.' })
  })

  myConnection.query(
    `select userName, name, dp, f.id from following f inner join userinfo u on fname=? and
      uname=userName and f.id<? order by f.id desc limit 10`,
    [`${req.query.un}`, `${req.query.id}`],
    (err, results) => {
      if (err) {
        res.status(500).json({ msg: 'Server error.' })
      } else {
        if (results.length) {
          res.status(200).json(results)
        } else {
          res.status(400).json({ msg: 'No followers.' })
        }
      }
    }
  )

  myConnection.end()
})

// add following
router.post('/add', auth, (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    `insert into following(uname, fname) values(?, ?)`,
    [`${req.userName}`, `${req.body.fn}`],
    (err, results) => {
      if (err) return res.status(500).json({ msg: err.message })
      res.status(200).json({ msg: 'Follower added.' })
    }
  )

  myConnection.end()
})

// remove following
router.delete('/remove', auth, (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    'delete from following where uname=? and fname=?',
    [`${req.userName}`, `${req.body.fn}`],
    (err, results) => {
      if (err) return res.status(500).json({ msg: err.message })
      res.status(200).json({ msg: 'Following removed.' })
    }
  )

  myConnection.end()
})

module.exports = router
