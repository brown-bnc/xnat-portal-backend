var express = require('express')
var router = express.Router()

/* GET ping-pong test response. */
router.get('/ping', function (req, res, next) {
  res.json({ message: 'Pong!' })
})

module.exports = router
