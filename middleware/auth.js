const jwt = require('jsonwebtoken')

require('dotenv').config()

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token')

  // If token is not present
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' })
  }

  // verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.userName = decoded.userName

    next()
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' })
  }
}
