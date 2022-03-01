const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

require('dotenv').config()

// Check whether the user is available
router.get('/check', (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: 'Server error.' })
  })

  myConnection.query(
    `select userName from userinfo where userName=?`,
    [`${req.query.un}`],
    (err, results) => {
      if (err) {
        res.status(500).json({ msg: 'Server error.' })
      } else {
        if (results.length) {
          res.status(400).json({ msg: 'Username already taken.' })
        } else {
          res.status(200).json({ msg: 'Username available.' })
        }
      }
    }
  )

  myConnection.end()
})

// register user (signup)
router.post('/signup', async (req, res) => {
  const data = req.body

  const hashedPwd = await bcrypt.hash(data.pwrd, 10)

  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: 'Server error.' })
  })

  myConnection.query(
    `insert into userinfo(userName, name, city, about, dp, pwrd) values('${data.userName}', '${data.name}',
      '${data.city}', '${data.about}', '${data.dp}', '${hashedPwd}')`,
    (err, results) => {
      if (err) {
        console.log(err.message)
        res.status(500).json({ msg: 'Server error.' })
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
              res.status(200).json({ token, name: data.name })
            }
          }
        )
      }
    }
  )

  myConnection.end()
})

// Sign In and get token (signin)
router.post('/signin', (req, res) => {
  const data = req.body

  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: 'Server error.' })
  })

  myConnection.query(
    `select name, pwrd from userinfo where userName=?`,
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
                  res.status(200).json({ token, name: results[0].name })
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
