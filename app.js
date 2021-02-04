const createError = require('http-errors')
const express = require('express')

// Load up the environment variables.
require('dotenv').config()

const indexRouter = require('./routes/index')
const projectsRouter = require('./routes/projects')

const app = express()

app.use('/', indexRouter)
app.use('/projects', projectsRouter)

// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json({ error: err })
})

module.exports = app
