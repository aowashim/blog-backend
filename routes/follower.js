const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const auth = require('../middleware/auth')

require('dotenv').config()

// get all the followers
router.get('', (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: 'Server error.' })
  })

  myConnection.query(
    `select userName, name, dp from followers f inner join userinfo u on uname=? and
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

// add follower
router.post('', auth, (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: 'Server error.' })
  })

  myConnection.query(
    `insert into followers(uname, fname) values('${req.userName}', '${req.query.fn}')`,
    (err, results) => {
      if (err) {
        console.log(err.message)
        res.status(500).json({ msg: 'Server error.' })
      } else {
        res.status(200).json({ msg: 'Follower added.' })
      }
    }
  )

  myConnection.end()
})

// remove a bookmark
router.delete('/', auth, (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: 'Server error.' })
  })

  myConnection.query(
    'delete from bookmarks where uname=? and pid=?',
    [`${req.userName}`, `${req.body.pid}`],
    (err, results) => {
      if (err) {
        res.status(500).json({ msg: 'Server error.' })
      } else {
        res.status(200).json({ msg: 'Bookmark removed.' })
      }
    }
  )

  myConnection.end()
})

module.exports = router
