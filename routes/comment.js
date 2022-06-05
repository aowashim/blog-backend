const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const auth = require('../middleware/auth')

require('dotenv').config()

// get comments
router.get('', (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    `select * from comments where pid=? and cid<? order by cid desc limit 10`,
    [req.query.pid, req.query.cid],
    (err, results) => {
      if (err) {
        res.status(500).json({ msg: err.message })
      } else {
        if (results.length) {
          res.status(200).json(results)
        } else {
          res.status(400).json({ msg: 'No comments available.' })
        }
      }
    }
  )

  myConnection.end()
})

// create a comment
router.post('', auth, (req, res) => {
  const data = req.body

  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    `insert into comments(uname, pid, content, cdate, name) values(?, ?, ?, ?, ?)`,
    [req.userName, data.pid, data.content, data.cdate, data.name],
    (err, results) => {
      if (err) {
        res.status(500).json({ msg: err.message })
      } else {
        res.status(200).json({ msg: 'Comment created.' })
      }
    }
  )

  myConnection.end()
})

module.exports = router
