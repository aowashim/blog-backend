const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

require('dotenv').config()

// register user (signup)
router.post('/signup', async (req, res) => {
  const data = req.body

  const hashedPwd = await bcrypt.hash(data.pwrd, 10)

  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: 'Server error.' })
  })

  myConnection.query(
    `insert into userinfo(email, name, city, about, dp, pwrd) values('${data.email}', '${data.name}',
      '${data.city}', '${data.about}', '${data.dp}', '${hashedPwd}')`,
    (err, results) => {
      if (err) {
        res.status(500).json({ msg: 'Server error.' })
      } else {
        myConnection.query(
          `select uid, pwrd from userinfo where email=?`,
          [`${data.email}`],
          async (err, results) => {
            if (err) {
              res.status(500).json({ msg: 'Server error.' })
            } else {
              if (results.length) {
                jwt.sign(
                  {
                    uid: results[0].uid,
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
              } else {
                return res.status(400).json({ msg: 'Invalid credentials.' })
              }
            }
            myConnection.end()
          }
        )
      }
    }
  )
})

// Sign In and get token (signin)
router.post('/signin', async (req, res) => {
  const data = req.body

  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) return res.status(500).json({ msg: 'Server error.' })
  })

  myConnection.query(
    `select uid, pwrd from userinfo where email=?`,
    [`${data.email}`],
    async (err, results) => {
      if (err) {
        res.status(500).json({ msg: 'Server error.' })
      } else {
        if (results.length) {
          const isMatch = await bcrypt.compare(data.pwrd, results[0].pwrd)

          if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials.' })
          }

          jwt.sign(
            {
              uid: results[0].uid,
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
        } else {
          return res.status(400).json({ msg: 'Invalid credentials.' })
        }
      }
    }
  )

  myConnection.end()
})

module.exports = router
