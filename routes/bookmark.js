const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const auth = require('../middleware/auth')

require('dotenv').config()

// get all the bookmarks of a user
router.get('', auth, (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    `select * from bookmarks where uname=? and bid<? order by bid desc limit 10`,
    [`${req.userName}`, `${req.query.id}`],
    (err, results) => {
      if (err) {
        res.status(500).json({ msg: err.message })
      } else {
        if (results.length) {
          res.status(200).json(results)
        } else {
          res.status(400).json({ msg: 'No bookmarks.' })
        }
      }
    }
  )

  myConnection.end()
})

// add a bookmark
router.post('/', auth, (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    `insert into bookmarks(uname, pid, b_title) values('${req.userName}', ${req.body.pid}, '${req.body.title}')`,
    (err, results) => {
      if (err) {
        console.log(err.message)
        res.status(500).json({ msg: err.message })
      } else {
        res.status(200).json({ msg: 'Bookmark created.' })
      }
    }
  )

  myConnection.end()
})

// remove a bookmark
router.delete('/', auth, (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    'delete from bookmarks where uname=? and pid=?',
    [`${req.userName}`, `${req.body.pid}`],
    (err, results) => {
      if (err) {
        res.status(500).json({ msg: err.message })
      } else {
        res.status(200).json({ msg: 'Bookmark removed.' })
      }
    }
  )

  myConnection.end()
})

module.exports = router
