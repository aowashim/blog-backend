const express = require('express')

const app = express()
const hostname = '0.0.0.0'

app.use(express.json())

app.get('/', (req, res) => res.send('API running...'))

// Define routes
app.use('/test', require('./routes/test'))
app.use('/auth', require('./routes/auth'))
app.use('/user', require('./routes/user'))
app.use('/profile', require('./routes/profile'))
app.use('/post', require('./routes/post'))
app.use('/bookmark', require('./routes/bookmark'))
app.use('/f', require('./routes/following'))
app.use('/s', require('./routes/search'))
app.use('/comment', require('./routes/comment'))

const PORT = process.env.PORT || 5000

app.listen(PORT, hostname, () =>
  console.log(`Server running on port : ${PORT}`)
)
