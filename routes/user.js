const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

require('dotenv').config()

router.get('/', (req, res) => {
  //console.log(req.headers)

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
    `select * from userinfo where email=?`,
    ['aowashi@gm.co'],
    async (err, results) => {
      if (err) {
        res.status(500).json({ msg: 'Server error.' })
      } else {
        //const isMatch = await bcrypt.compare('password1', results[0].password)

        // if (!isMatch) {
        //   return res.status(400).json({ msg: 'Invalid credentials.' })
        // } else {
        res.status(200).json(results[0])
        //}
      }
    }
  )

  myConnection.end()
})

router.post('/signup', async (req, res) => {
  const data = req.body

  //console.log(data)

  const hashedPwd = await bcrypt.hash(data.pwrd, 10)

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
    `insert into userinfo(email, name, city, state, pwrd) values('${data.email}', '${data.name}',
      '${data.city}', '${data.state}', '${hashedPwd}')`,
    (err, results) => {
      if (err) {
        console.log(err.message)
        res.status(500).json({ msg: 'Server error.' })
      } else {
        res.status(200).json({ msg: 'Data inserted.' })
      }
    }
  )

  myConnection.end()
})

module.exports = router
