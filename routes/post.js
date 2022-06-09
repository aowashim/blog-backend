const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const auth = require('../middleware/auth')

require('dotenv').config()

// get all posts auth (from all users)
router.get('/auth', auth, (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    `select p.pid, userName, name, dp, title, description, pdate, image, b.pid bm from posts p
      inner join userinfo u on p.uname=userName and p.pid<? left join bookmarks b on b.uname=? and p.pid=b.pid
      order by p.pid desc limit 10`,
    [`${req.query.id}`, `${req.userName}`],
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

// get all posts from all users (public)
router.get('/all', (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    `select p.pid, userName, name, dp, title, description, pdate, image, b.pid bm from posts p
      inner join userinfo u on p.uname=userName and p.pid<? left join bookmarks b on b.uname='' and p.pid=b.pid
      order by p.pid desc limit 10`,
    [`${req.query.id}`],
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

// get all posts auth from following (auth)
router.get('/auth/following', auth, (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    `select p.pid, userName, name, dp, title, description, pdate, image, b.pid bm from posts p
      inner join userinfo u on p.uname=userName and p.pid<? and userName in (select fname from following where uname=?)
      left join bookmarks b on b.uname=? and p.pid=b.pid order by p.pid desc limit 10`,
    [`${req.query.id}`, `${req.userName}`, `${req.userName}`],
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

// get user posts auth
router.get('/user/auth', auth, (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    `select p.pid, userName, name, dp, title, description, pdate, image, b.pid bm from posts p
      inner join userinfo u on p.uname=userName and userName=? and p.pid<? left join bookmarks b on b.uname=? and
      p.pid=b.pid order by p.pid desc limit 10`,
    [`${req.query.un}`, `${req.query.id}`, `${req.userName}`],
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

// get user posts (public)
router.get('/user/', (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    `select p.pid, userName, name, dp, title, description, pdate, image, b.pid bm from posts p
      inner join userinfo u on p.uname=userName and userName=? and p.pid<? left join bookmarks b on b.uname='' and
      p.pid=b.pid order by p.pid desc limit 10`,
    [`${req.query.un}`, `${req.query.id}`],
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

// get user post auth (single post)
router.get('/auth/one', auth, (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    `select p.pid, userName, name, dp, title, description, pdate, image, b.pid bm from posts p
      inner join userinfo u on p.uname=userName and p.pid=? left join bookmarks b on b.uname=? and p.pid=b.pid`,
    [`${req.query.id}`, `${req.userName}`],
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

// create a post
router.post('', auth, (req, res) => {
  const data = req.body

  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: err.message })
  })

  myConnection.query(
    `insert into posts(uname, title, description, pdate, image, url, category) values('${req.userName}', '${data.title}',
        '${data.description}', '${data.pdate}', '${data.image}', '${data.url}', '${data.catg}')`,
    (err, results) => {
      if (err) {
        res.status(500).json({ msg: err.message })
      } else {
        res.status(200).json({ msg: 'Post created.' })
      }
    }
  )

  myConnection.end()
})

module.exports = router
