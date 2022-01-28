const testMW = (req, res, next) => {
  console.log('Middleware called...')
  next()
}

module.exports = testMW
