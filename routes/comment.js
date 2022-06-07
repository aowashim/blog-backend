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
    `select u.name, u.dp, c.uname, c.cid, c.content from comments c inner join userinfo u
      on c.pid=? and c.uname = u.userName and c.cid<? order by c.cid desc limit 10`,
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
    `insert into comments(uname, pid, content, cdate) values(?, ?, ?, ?)`,
    [req.userName, data.pid, data.content, data.cdate],
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
