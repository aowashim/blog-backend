const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const auth = require('../middleware/auth')

require('dotenv').config()

// search post
router.get('/post', (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    `select p.pid, userName, name, dp, title, description, location, pdate, image, b.pid bm from posts p
      inner join userinfo u on p.uname=userName and title regexp ? and p.pid<? left join bookmarks b
      on b.uname='' and p.pid=b.pid order by p.pid desc limit 10`,
    [`${req.query.key}`, `${req.query.pid}`],
    (err, results) => {
      if (err) {
        res.status(500).json({ msg: err.message })
      } else {
        if (results.length) {
          res.status(200).json(results)
        } else {
          res.status(400).json({ msg: 'No posts available.' })
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
    if (err) return res.status(500).json({ msg: 'Server error.' })
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

module.exports = router
