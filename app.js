const createError = require('http-errors')
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const jsonErrorHandler = async (err, req, res, next) => {
  res.status(500).send({ error: err });
}

require('dotenv').config()

const indexRouter = require('./routes/index')
const projectsRouter = require('./routes/xnat-projects')
const globusMdirRouter = require('./routes/globus-mkdir')
const globusLsRouter = require('./routes/globus-ls')
const globusAccessRouter = require('./routes/globus-access')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(jsonErrorHandler)
app.use('/', indexRouter)
app.use('/projects', projectsRouter)
app.use('/mkdir', globusMdirRouter)
app.use('/ls', globusLsRouter)
app.use('/access', globusAccessRouter)

// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, _next) {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app
