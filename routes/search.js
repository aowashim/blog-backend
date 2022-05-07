const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const auth = require('../middleware/auth')

require('dotenv').config()

// search post by title (public)
router.get('/post', (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    `select p.pid, userName, name, dp, title, description, pdate, image, b.pid bm from posts p
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

// search post by category (public)
router.get('/post/catg', (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    `select p.pid, userName, name, dp, title, description, pdate, image, b.pid bm from posts p
      inner join userinfo u on p.uname=userName and category regexp ? and p.pid<? left join bookmarks b
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

// search people by name
router.get('/users', (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    `select userName, uid as id, name, dp from userinfo where name regexp ? and uid<?
      order by uid desc limit 10`,
    [`${req.query.key}`, `${req.query.uid}`],
    (err, results) => {
      if (err) {
        res.status(500).json({ msg: err.message })
      } else {
        if (results.length) {
          res.status(200).json(results)
        } else {
          res.status(400).json({ msg: 'No users available.' })
        }
      }
    }
  )

  myConnection.end()
})

// search people by username
router.get('/users/un', (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    `select userName, uid as id, name, dp from userinfo where userName=? and uid<?`,
    [`${req.query.key}`, `${req.query.uid}`],
    (err, results) => {
      if (err) {
        res.status(500).json({ msg: err.message })
      } else {
        if (results.length) {
          res.status(200).json(results)
        } else {
          res.status(400).json({ msg: 'No users available.' })
        }
      }
    }
  )

  myConnection.end()
})

module.exports = router
