const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const bcrypt = require('bcrypt')

require('dotenv').config()

router.get('/', (req, res) => {
  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) {
      //console.log(err.message)
      return res.status(500).json({ msg: 'Server error.' })
    } else {
      console.log('Connected to the database...')
    }
  })

  myConnection.query(
    `select password from auth where email='ahjkh@g.vo'`,
    async (err, results) => {
      if (err) {
        res.status(500).json({ msg: 'Server error.' })
      } else {
        const isMatch = await bcrypt.compare('password1', results[0].password)

        if (!isMatch) {
          return res.status(400).json({ msg: 'Invalid credentials.' })
        } else {
          res.status(200).json(results[0].password)
        }
      }
    }
  )

  myConnection.end()
})

router.post('/', async (req, res) => {
  const hashedPwd = await bcrypt.hash('password', 10)

  const myConnection = mysql.createConnection(process.env.DB)

  myConnection.connect(err => {
    if (err) {
      //console.log(err.message)
      return res.status(500).json({ msg: 'Server error.' })
    } else {
      console.log('Connected to the database...')
    }
  })

  myConnection.query(
    `insert into auth values('ahjkh@g.vo', '${hashedPwd}')`,
    (err, results) => {
      if (err) {
        console.log(err.message)
        res.status(500).json({ msg: 'Server error.' })
      } else {
        res.status(200).json(results)
      }
    }
  )

  myConnection.end()
})

module.exports = router
