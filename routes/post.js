const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const auth = require('../middleware/auth')

require('dotenv').config()

// Check whether the user is available
router.get('/all', (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: 'Server error.' })
  })

  myConnection.query(
    `select p.pid, userName, name, dp, title, description, location, pdate, image, b.pid bm from posts p
      inner join userinfo u on p.uname=userName left join bookmarks b on b.uname=userName and p.pid=b.pid
      where p.pid<? order by p.pid desc limit 10`,
    [`${req.query.id}`],
    (err, results) => {
      if (err) {
        console.log(err.message)
        res.status(500).json({ msg: 'Server error.' })
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
    if (err) return res.status(500).json({ msg: 'Server error.' })
  })

  myConnection.query(
    `insert into posts(uname, title, description, location, ip, pdate, image) values('${req.userName}', '${data.title}',
        '${data.description}', '${data.location}', '${data.ip}', '${data.pdate}', '${data.image}')`,
    (err, results) => {
      if (err) {
        res.status(500).json({ msg: 'Server error.' })
      } else {
        res.status(200).json({ msg: 'Post created.' })
      }
    }
  )

  myConnection.end()
})

// Sign In and get token (signin)
router.post('/signin', async (req, res) => {
  const data = req.body

  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: 'Server error.' })
  })

  myConnection.query(
    `select pwrd from userinfo where userName=?`,
    [`${data.userName}`],
    async (err, results) => {
      if (err) {
        res.status(500).json({ msg: 'Server error.' })
      } else {
        if (results.length) {
          const isMatch = await bcrypt.compare(data.pwrd, results[0].pwrd)

          if (!isMatch) {
            res.status(400).json({ msg: 'Invalid credentials.' })
          } else {
            jwt.sign(
              {
                userName: data.userName,
              },
              process.env.JWT_SECRET,
              (err, token) => {
                if (err) {
                  res.status(500).json({ msg: 'Server error.' })
                } else {
                  res.status(200).json({ token })
                }
              }
            )
          }
        } else {
          res.status(400).json({ msg: 'Invalid credentials.' })
        }
      }
    }
  )

  myConnection.end()
})

module.exports = router
