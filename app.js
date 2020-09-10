const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const port = 3000

// Load up the environment variables.
require('dotenv').config()

const indexRouter = require('./routes/index');
const projectsRouter = require('./routes/projects');

const app = express();

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(jwt({ secret: process.env.JWT_SECRET }))
// app.use(cookieParser());

app.use('/', indexRouter);
app.use('/projects', projectsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err })
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
module.exports = app;
