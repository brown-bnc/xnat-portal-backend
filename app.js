const createError = require('http-errors')
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')

require('dotenv').config()

const indexRouter = require('./routes/index')
const projectsRouter = require('./routes/projects')
const globusMdirRouter = require('./routes/globus-mkdir')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use('/', indexRouter)
app.use('/projects', projectsRouter)
app.use('/globusmkdir', globusMdirRouter)

// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
  next(createError(404))
})


module.exports = app
